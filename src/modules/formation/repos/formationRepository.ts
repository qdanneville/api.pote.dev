import { Formation } from '../domain/formation'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { FormationMap } from '../mappers/formationMap';

@Injectable()
export class FormationRepository {
    constructor(private readonly entities: PrismaService) { }

    getFormations() {
        const FormationModel = this.entities.formation
        return FormationModel.findMany();
    }

    async exists(title: string) {
        const FormationModel = this.entities.formation
        const formation = await FormationModel.findUnique({
            where: {
                title: title,
            },
        });
        return (!!formation);
    }

    async getFormationBySlug(slug: string) {
        const FormationModel = this.entities.formation
        const formation = await FormationModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return formation ? FormationMap.toDomain(formation) : null;
    }

    async getFormationByNotionPageId(notionPageId: string) {
        const FormationModel = this.entities.formation
        const formation = await FormationModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return formation ? FormationMap.toDomain(formation) : null;
    }

    async createFormation(formation: Formation) {
        const FormationModel = this.entities.formation

        const exists = await this.exists(formation.title)

        if (!exists) {
            const rawPrismaFormation = await FormationMap.toPersistence(formation)

            await FormationModel.create({
                data: {
                    ...rawPrismaFormation,
                },
            });
        }

        return
    }

    async updateFormation(formation: Formation) {
        const FormationModel = this.entities.formation
        const rawPrismaFormation = await FormationMap.toPersistence(formation)

        const { id } = rawPrismaFormation

        await FormationModel.update({
            where: {
                id,
            },
            data: {
                ...rawPrismaFormation,
            },
        });

        return
    }
}