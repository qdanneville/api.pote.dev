import { Formation } from '../domain/formation'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { FormationMap } from '../mappers/formationMap';

@Injectable()
export class FormationRepository {
    constructor(private readonly entities: PrismaService) { }

    async getFormations({ difficulty, technology }) {
        const FormationModel = this.entities.formation

        const formations = await FormationModel.findMany({
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
                    }
                ]
            },
            include: {
                difficulty: true,
                technologies: true,
                courses: {
                    include: {
                        difficulty: true,
                        tags: true,
                        technologies: true
                    }
                }
            }
        })

        return formations.map(formation => FormationMap.toDomain(formation))
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
            include: {
                difficulty: true,
                technologies: true,
                courses: {
                    include: {
                        difficulty: true,
                        tags: true,
                        technologies: true,
                        chapters: {
                            include : {
                                lessons:true
                            }
                        }
                    }
                }
            }
        });

        return formation ? FormationMap.toDomain(formation) : null;
    }

    async getFormationByNotionPageId(notionPageId: string) {
        const FormationModel = this.entities.formation
        const formation = await FormationModel.findUnique({
            where: {
                notionPageId: notionPageId,
            },
            include: {
                difficulty: true
            }
        });

        return formation ? FormationMap.toDomain(formation) : null;
    }

    async createFormation(formation: Formation) {
        const FormationModel = this.entities.formation

        const exists = await this.exists(formation.title)

        if (!exists) {
            const rawPrismaFormation = await FormationMap.toPersistence(formation)

            const { courses, technologies, difficultyId, ...data } = rawPrismaFormation

            const dataToInsert = {
                ...data,
                courses: courses.length > 0
                    ? { connect: courses }
                    : undefined,
                difficulty: difficultyId
                    ? { connect: { id: difficultyId } }
                    : undefined,
                technologies: technologies.length > 0
                    ? { connect: technologies }
                    : undefined,
            }

            await FormationModel.create({
                data: {
                    ...dataToInsert
                },
            });
        }

        return
    }

    async updateFormation(formation: Formation) {
        const FormationModel = this.entities.formation
        const rawPrismaFormation = await FormationMap.toPersistence(formation)

        const { id, courses, technologies, difficultyId, ...data } = rawPrismaFormation

        const dataToInsert = {
            ...data,
            courses: {
                set: courses
            },
            difficulty: difficultyId
                ? { connect: { id: difficultyId } }
                : { disconnect: true },
            technologies: {
                set: technologies
            }
        }

        await FormationModel.update({
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