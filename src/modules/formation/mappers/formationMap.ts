import { Formation } from '../domain/formation';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';

export class FormationMap {
    public static async toPersistence(formation: Formation): Promise<any> {
        return {
            id: formation.id.toString(),
            slug: formation.slug,
            notionPageId: formation.notionPageId,
            title: formation.title,
            imageUrl: formation.imageUrl,
            isPublished: formation.isPublished,
        }
    }

    public static async toDomain(raw: any): Promise<Formation> {

        const formationDomain = Formation.create({
            slug: raw.slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            isPublished: raw.isPublished,
            imageUrl: raw.imageUrl
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