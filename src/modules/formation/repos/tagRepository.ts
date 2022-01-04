import { Tag } from '../domain/Tag'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { TagMap } from '../mappers/TagMap';

@Injectable()
export class TagRepository {
    constructor(private readonly entities: PrismaService) { }

    getTags() {
        const TagModel = this.entities.tag
        return TagModel.findMany();
    }

    async exists(name: string) {
        const TagModel = this.entities.tag
        const tag = await TagModel.findUnique({
            where: {
                name: name,
            },
        });
        return (!!tag);
    }

    async getTagBySlug(slug: string) {
        const TagModel = this.entities.tag
        const tag = await TagModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return tag ? TagMap.toDomain(tag) : null;
    }

    async getTagByNotionPageId(notionPageId: string) {
        const TagModel = this.entities.tag
        const tag = await TagModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return tag ? TagMap.toDomain(tag) : null;
    }

    async createTag(tag: Tag) {
        const TagModel = this.entities.tag

        const exists = await this.exists(tag.name)

        if (!exists) {
            const rawPrismaTag = await TagMap.toPersistence(tag)

            await TagModel.create({
                data: {
                    ...rawPrismaTag,
                },
            });
        }

        return
    }

    async updateTag(tag: Tag) {
        const TagModel = this.entities.tag
        const rawPrismaTag = await TagMap.toPersistence(tag)

        const { id } = rawPrismaTag

        await TagModel.update({
            where: {
                id,
            },
            data: {
                ...rawPrismaTag,
            },
        });

        return
    }
}