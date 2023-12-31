import { Formation } from '../domain/formation';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import { Difficulty } from '../domain/difficulty';
import { Technology } from '../domain/technology';
import { DifficultyMap } from './difficultyMap';
import { TechnologyMap } from './technologyMap';
import { CourseMap } from './courseMap';

export class FormationMap {
    public static async toPersistence(formation: Formation): Promise<any> {

        const data = {
            id: formation.id.toString(),
            slug: formation.slug.value,
            description: formation.description,
            notionPageId: formation.notionPageId,
            title: formation.title,
            imageUrl: formation.imageUrl,
            icon: formation.icon,
            isPublished: formation.isPublished,
            courses: formation.courses ? formation.courses.map(course => ({ id: course })) : [],
            difficultyId: formation.difficulty ? formation.difficultyId : null,
            technologies: formation.technologies ? formation.technologies.map(technology => ({ id: technology })) : []
        }

        return data
    }

    public static toDomain(raw: any): Formation {
        const slug = Slug.create({ value: raw.slug })
        const difficulty = DifficultyMap.toDomain(raw.difficulty)
        const technologies = raw.technologies?.map(technology => TechnologyMap.toDomain(technology))
        const courses = raw.courses?.map(course => CourseMap.toDomain(course))

        const formationDomain = Formation.create({
            slug,
            description: raw.description,
            notionPageId: raw.notionPageId,
            title: raw.title,
            isPublished: raw.isPublished,
            imageUrl: raw.imageUrl,
            icon: raw.icon,
            difficulty: difficulty,
            technologies: technologies,
            courses: courses,
        }, new UniqueEntityID(raw.id));

        return formationDomain ? formationDomain : null;
    }

    //TODO DTO formation response
    public static toResponse(formation: Formation): any {
        const formationResponse = {
            slug: formation.slug.value,
            description: formation.description,
            title: formation.title,
            imageUrl: formation.imageUrl,
            icon: formation.icon,
            difficulty: formation.difficulty.name,
            technologies: formation.technologies.map(technology => technology.name),
            nbCourses: formation.courses?.length
        }

        return formationResponse
    }

    public static toFormationDetailResponse(formation: Formation): any {
        const formationResponse = {
            slug: formation.slug.value,
            description: formation.description,
            title: formation.title,
            imageUrl: formation.imageUrl,
            icon: formation.icon,
            difficulty: formation.difficulty.name,
            technologies: formation.technologies.map(technology => technology.name),
            courses: formation.courses.map(course => CourseMap.toResponse(course)),
            notionPageId: formation.notionPageId
        }

        return formationResponse
    }
}

// Persistence
// model Formation {
//     id           String  @id @default(uuid())
//     slug         String  @unique
//     title        String  @unique
//     notionPageId String
//     imageUrl     String?

//     courses    Course[]

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }

// Domain
// interface FormationProps {
//     slug: string,
//     title: string,
//     imageUrl: string,
//     isPublished: boolean
// }