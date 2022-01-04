import { Difficulty } from '../domain/difficulty';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { DifficultyMap } from '../mappers/difficultyMap';

@Injectable()
export class DifficultyRepository {
    constructor(private readonly entities: PrismaService) { }

    getTechnologies() {
        const DifficultyModel = this.entities.difficulty
        return DifficultyModel.findMany();
    }

    async exists(name: string) {
        const DifficultyModel = this.entities.difficulty
        const difficulty = await DifficultyModel.findUnique({
            where: {
                name: name,
            },
        });
        return (!!difficulty);
    }

    async getDifficultyBySlug(slug: string) {
        const DifficultyModel = this.entities.difficulty
        const difficulty = await DifficultyModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return difficulty ? DifficultyMap.toDomain(difficulty) : null;
    }

    async getDifficultyByNotionPageId(notionPageId: string) {
        const DifficultyModel = this.entities.difficulty
        const difficulty = await DifficultyModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return difficulty ? DifficultyMap.toDomain(difficulty) : null;
    }

    async createDifficulty(difficulty: Difficulty) {
        const difficultyModel = this.entities.difficulty

        const exists = await this.exists(difficulty.name)

        if (!exists) {
            const rawPrismadifficulty = await DifficultyMap.toPersistence(difficulty)

            await difficultyModel.create({
                data: {
                    ...rawPrismadifficulty,
                },
            });
        }

        return
    }

    async updateDifficulty(difficulty: Difficulty) {
        const DifficultyModel = this.entities.difficulty
        const rawPrismadifficulty = await DifficultyMap.toPersistence(difficulty)

        const { id } = rawPrismadifficulty

        await DifficultyModel.update({
            where: {
                id,
            },
            data: {
                ...rawPrismadifficulty,
            },
        });

        return
    }
}