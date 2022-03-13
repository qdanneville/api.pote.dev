import { Course } from '../domain/course'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { CourseMap } from '../mappers/courseMap';

@Injectable()
export class CourseRepository {
    constructor(private readonly entities: PrismaService) { }

    async getCourses({ difficulty, technology, tags }) {
        const CourseModel = this.entities.course

        const coursesFilter = {
            where: {
                AND: [
                    {
                        difficulty: {
                            name: {
                                equals: difficulty
                            }
                        }
                    },
                    {
                        technologies: {
                            some: {
                                name: {
                                    equals: technology
                                }
                            }
                        }
                    },
                ]
            },
            include: {
                difficulty: true,
                technologies: true,
                tags: true,
                prerequisites:true,
                chapters: {
                    include : {
                        lessons:true
                    }
                }
            }
        }

        //Tags could either be a single string tag like = "exercice"
        //OR a string array like ["exercice", "fondamentaux"]
        //This might be revamped ?

        if (tags) {
            typeof tags === 'string'
                ? coursesFilter.where.AND.push({
                    tags: {
                        some: {
                            name: tags,
                        },
                    },
                } as any)
                : tags.forEach(tag => {
                    coursesFilter.where.AND.push({
                        tags: {
                            some: {
                                name: tag,
                            },
                        },
                    } as any)
                })
        }

        const courses = await CourseModel.findMany(coursesFilter)

        return courses.map(formation => CourseMap.toDomain(formation))
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
            include: {
                difficulty: true,
                technologies: true,
                tags: true,
                chapters: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        return course ? CourseMap.toDomain(course) : null;
    }

    async getCourseByNotionPageId(notionPageId: string) {
        const CourseModel = this.entities.course
        const course = await CourseModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
            include: {
                difficulty: true,
                technologies: true,
                tags: true,
                prerequisites: true
            }
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

            await CourseModel.create({
                data: {
                    ...dataToInsert
                }
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

        await CourseModel.update({
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