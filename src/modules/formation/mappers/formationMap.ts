import { Formation } from '../domain/formation';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import { Difficulty } from '../domain/difficulty';
import { Technology } from '../domain/technology';

export class FormationMap {
    public static async toPersistence(formation: Formation): Promise<any> {

        const data = {
            id: formation.id.toString(),
            slug: formation.slug.value,
            notionPageId: formation.notionPageId,
            title: formation.title,
            imageUrl: formation.imageUrl,
            isPublished: formation.isPublished,
        }

        data["difficultyId"] = formation.difficulty ? formation.difficultyId : null
        data["technologies"] = formation.technologies ? formation.technologies.map(technology => ({ id: technology })) : []

        return data
    }

    public static async toDomain(raw: any): Promise<Formation> {
        const slug = Slug.create({ value: raw.slug })
        const difficulty = Difficulty.create(raw.difficulty)
        const technologies = raw.technologies?.map(technology => Technology.create(technology))

        const formationDomain = Formation.create({
            slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            isPublished: raw.isPublished,
            imageUrl: raw.imageUrl,
            difficulty: difficulty,
            technologies: technologies
        }, new UniqueEntityID(raw.id));

        return formationDomain ? formationDomain : null;
    }

    //TODO DTO formation response
    public static toResponse(formation: Formation): any {
        const formationResponse = {
            slug: formation.slug,
            title: formation.title,
            imageUrl: formation.imageUrl
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