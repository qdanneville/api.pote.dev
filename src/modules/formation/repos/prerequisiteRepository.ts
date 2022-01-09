import { Prerequisite } from '../domain/prerequisite';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { PrerequisiteMap } from '../mappers/prerequisiteMap';

@Injectable()
export class PrerequisiteRepository {
    constructor(private readonly entities: PrismaService) { }

    getTechnologies() {
        const PrerequisiteModel = this.entities.prerequisite
        return PrerequisiteModel.findMany();
    }

    async exists(name: string) {
        const PrerequisiteModel = this.entities.prerequisite
        const prerequisite = await PrerequisiteModel.findUnique({
            where: {
                name: name,
            },
        });
        return (!!prerequisite);
    }

    async getPrerequisiteByName(name: string) {
        const PrerequisiteModel = this.entities.prerequisite
        const prerequisite = await PrerequisiteModel.findUnique({
            where: {
                name: name,
            },
        });

        return prerequisite ? PrerequisiteMap.toDomain(prerequisite) : null;
    }

    async getPrerequisiteByNotionPageId(notionPageId: string) {
        const PrerequisiteModel = this.entities.prerequisite
        const prerequisite = await PrerequisiteModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return prerequisite ? PrerequisiteMap.toDomain(prerequisite) : null;
    }

    async createPrerequisite(prerequisite: Prerequisite) {
        const PrerequisiteModel = this.entities.prerequisite

        const exists = await this.exists(prerequisite.name)

        if (!exists) {
            const rawPrismaPrerequisite = await PrerequisiteMap.toPersistence(prerequisite)

            await PrerequisiteModel.create({
                data: {
                    ...rawPrismaPrerequisite,
                },
            });
        }

        return
    }

    async updatePrerequisite(prerequisite: Prerequisite) {
        const PrerequisiteModel = this.entities.prerequisite
        const rawPrismaPrerequisite = await PrerequisiteMap.toPersistence(prerequisite)

        const { id } = rawPrismaPrerequisite

        await PrerequisiteModel.update({
            where: {
                id,
            },
            data: {
                ...rawPrismaPrerequisite,
            },
        });

        return
    }
}