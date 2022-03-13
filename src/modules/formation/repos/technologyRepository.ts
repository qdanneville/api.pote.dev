import { Technology } from '../domain/technology';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { TechnologyMap } from '../mappers/technologyMap';

@Injectable()
export class TechnologyRepository {
    constructor(private readonly entities: PrismaService) { }

    async getTechnologies() {
        const TechnologyModel = this.entities.technology
        const entities = await TechnologyModel.findMany();

        return entities.map(entity => TechnologyMap.toDomain(entity))
    }

    async exists(name: string) {
        const TechnologyModel = this.entities.technology
        const technology = await TechnologyModel.findUnique({
            where: {
                name: name,
            },
        });
        return (!!technology);
    }

    async getTechnologyBySlug(slug: string) {
        const TechnologyModel = this.entities.technology
        const technology = await TechnologyModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return technology ? TechnologyMap.toDomain(technology) : null;
    }

    async getTechnologyByNotionPageId(notionPageId: string) {
        const technologyModel = this.entities.technology
        const technology = await technologyModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return technology ? TechnologyMap.toDomain(technology) : null;
    }

    async createTechnology(technology: Technology) {
        const TechnologyModel = this.entities.technology

        const exists = await this.exists(technology.name)

        if (!exists) {
            const rawPrismatechnology = await TechnologyMap.toPersistence(technology)

            await TechnologyModel.create({
                data: {
                    ...rawPrismatechnology,
                },
            });
        }

        return
    }

    async updateTechnology(technology: Technology) {
        const TechnologyModel = this.entities.technology
        const rawPrismatechnology = await TechnologyMap.toPersistence(technology)

        const { id } = rawPrismatechnology

        await TechnologyModel.update({
            where: {
                id,
            },
            data: {
                ...rawPrismatechnology,
            },
        });

        return
    }
}