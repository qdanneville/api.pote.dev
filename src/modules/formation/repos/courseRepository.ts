import { Course } from '../domain/course'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { CourseMap } from '../mappers/CourseMap';

@Injectable()
export class CourseRepository {
    constructor(private readonly entities: PrismaService) { }

    getCourses() {
        const CourseModel = this.entities.course
        return CourseModel.findMany();
    }

    async exists(title: string) {
        const CourseModel = this.entities.course
        const course = await CourseModel.findUnique({
            where: {
                title: title,
            },
        });
        return (!!course);
    }

    async getCourseBySlug(slug: string) {
        const CourseModel = this.entities.course
        const course = await CourseModel.findUnique({
            where: {
                slug: slug,
            },
        });

        return course ? CourseMap.toDomain(course) : null;
    }

    async getCourseByNotionPageId(notionPageId: string) {
        const CourseModel = this.entities.course
        const course = await CourseModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
        });

        return course ? CourseMap.toDomain(course) : null;
    }

    async createCourse(course: Course) {
        const CourseModel = this.entities.course

        const exists = await this.exists(course.title)

        if (!exists) {
            const rawPrismaCourse = await CourseMap.toPersistence(course)

            const { technologies, difficultyId, tags, prerequisites, ...data } = rawPrismaCourse

            const dataToInsert = {
                ...data,
                difficulty: difficultyId
                    ? { connect: { id: difficultyId } }
                    : undefined,
                technologies: technologies.length > 0
                    ? { connect: technologies }
                    : undefined,
                tags: tags.length > 0
                    ? { connect: tags }
                    : undefined,
                prerequisites: prerequisites.length > 0
                    ? { connect: prerequisites }
                    : undefined
            }

            console.log('data inserted : ', dataToInsert);

            await CourseModel.create({
                data: {
                    ...dataToInsert
                },
            });
        }

        return
    }

    async updateCourse(course: Course) {
        const CourseModel = this.entities.course
        const rawPrismaCourse = await CourseMap.toPersistence(course)

        const { id, technologies, difficultyId, tags, prerequisites, ...data } = rawPrismaCourse

        const dataToInsert = {
            ...data,
            difficulty: difficultyId
                ? { connect: { id: difficultyId } }
                : { disconnect: true },
            technologies: {
                set: technologies,
            },
            tags: {
                set: tags,
            },
            prerequisites: {
                set: prerequisites,
            }
        }

        console.log('data inserted : ', dataToInsert);

        await CourseModel.update({
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