import { Lesson } from '../domain/Lesson'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { LessonMap } from '../mappers/LessonMap';

@Injectable()
export class LessonRepository {
    constructor(private readonly entities: PrismaService) { }

    getLessons() {
        const LessonModel = this.entities.lesson
        return LessonModel.findMany();
    }

    async exists(title: string) {
        const LessonModel = this.entities.lesson
        const Lesson = await LessonModel.findUnique({
            where: {
                title: title,
            },
        });
        return (!!Lesson);
    }

    async getLessonBySlug(slug: string) {
        const LessonModel = this.entities.lesson
        const lesson = await LessonModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return lesson ? LessonMap.toDomain(lesson) : null;
    }

    async getLessonByNotionPageId(notionPageId: string) {
        const LessonModel = this.entities.lesson
        const lesson = await LessonModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
            include: {
                chapter: {
                    include: {
                        course: {
                            include: {
                                difficulty: true,
                                technologies: true,
                                prerequisites: true,
                                tags: true
                            }
                        }
                    }
                }
            }
        });

        return lesson ? LessonMap.toDomain(lesson) : null;
    }

    async createLesson(lesson: Lesson) {
        const LessonModel = this.entities.lesson

        const exists = await this.exists(lesson.title)

        if (!exists) {
            const rawPrismaLesson = await LessonMap.toPersistence(lesson)

            const { chapterId, ...data } = rawPrismaLesson

            const dataToInsert = {
                ...data,
                chapter: chapterId
                    ? { connect: { id: chapterId } }
                    : undefined,
            }

            await LessonModel.create({
                data: {
                    ...dataToInsert
                }
            });
        }

        return
    }

    async updateLesson(lesson: Lesson) {
        const LessonModel = this.entities.lesson
        const rawPrismaLesson = await LessonMap.toPersistence(lesson)

        const { id, chapterId, ...data } = rawPrismaLesson

        const dataToInsert = {
            ...data,
            chapter: chapterId
                ? { connect: { id: chapterId } }
                : { disconnect: true },
        }

        await LessonModel.update({
            where: {
                id,
            },
            data: {
                ...dataToInsert
            }
        });

        return
    }
}