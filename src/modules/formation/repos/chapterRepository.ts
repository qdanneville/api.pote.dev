import { Chapter } from '../domain/Chapter'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { ChapterMap } from '../mappers/ChapterMap';

@Injectable()
export class ChapterRepository {
    constructor(private readonly entities: PrismaService) { }

    getChapters() {
        const ChapterModel = this.entities.chapter
        return ChapterModel.findMany();
    }

    async exists(title: string) {
        const ChapterModel = this.entities.chapter
        const chapter = await ChapterModel.findUnique({
            where: {
                title: title,
            },
        });
        return (!!chapter);
    }

    async getChapterBySlug(slug: string) {
        const ChapterModel = this.entities.chapter
        const chapter = await ChapterModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return chapter ? ChapterMap.toDomain(chapter) : null;
    }

    async getChapterByNotionPageId(notionPageId: string) {
        const ChapterModel = this.entities.chapter
        const chapter = await ChapterModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
            include: {
                course: {
                    include: {
                        difficulty: true,
                        technologies:true,
                        prerequisites:true,
                        tags:true
                    }
                }
            }
        });

        return chapter ? ChapterMap.toDomain(chapter) : null;
    }

    async createChapter(chapter: Chapter) {
        const ChapterModel = this.entities.chapter

        const exists = await this.exists(chapter.title)

        if (!exists) {
            const rawPrismaChapter = await ChapterMap.toPersistence(chapter)

            // const { courseId, chapterSteps ...data } = rawPrismaChapter
            const { courseId, ...data } = rawPrismaChapter

            const dataToInsert = {
                ...data,
                course: courseId
                    ? { connect: { id: courseId } }
                    : undefined,
                // chapterSteps: chapterSteps.length > 0
                //     ? { connect: chapterSteps }
                //     : undefined,
            }

            await ChapterModel.create({
                data: {
                    ...dataToInsert
                },
            });
        }

        return
    }

    async updateChapter(chapter: Chapter) {
        const ChapterModel = this.entities.chapter
        const rawPrismaChapter = await ChapterMap.toPersistence(chapter)

        // const { courseId, chapterSteps ...data } = rawPrismaChapter
        const { id, courseId, ...data } = rawPrismaChapter

        const dataToInsert = {
            ...data,
            course: courseId
                ? { connect: { id: courseId } }
                : { disconnect: true },
            // chapterSteps: {
            //     set: chapterSteps,
            // },
        }

        await ChapterModel.update({
            where: {
                id,
            },
            data: {
                ...dataToInsert
            },
        });

        return
    }
}