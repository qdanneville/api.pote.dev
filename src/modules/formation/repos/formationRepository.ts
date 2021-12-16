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

        return formation ? formation : null
    }

    async createOrUpdateFormation(formation: Formation) {
        const FormationModel = this.entities.formation

        const alreadyCreatedFormation = await this.getFormationBySlug(formation.slug)
        console.log('already created formation :', alreadyCreatedFormation)

        const rawPrismaFormation = await FormationMap.toPersistence(formation)

        if (!alreadyCreatedFormation) {
            await FormationModel.create({
                data: {
                    ...rawPrismaFormation,
                },
            });
        } else {
            const { id  } = alreadyCreatedFormation
            await FormationModel.update({
                where: {
                    id,
                },
                data: {
                    ...rawPrismaFormation,
                },
            });
        }

        return
    }
}