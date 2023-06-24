import { Technology } from '../domain/technology';
import { Slug } from '../domain/slug';

export class TechnologyMap {
    public static async toPersistence(technology: Technology): Promise<any> {

        return {
            id: technology.technologyId,
            slug: technology.slug.value,
            notionPageId: technology.notionPageId,
            name: technology.name,
            imageUrl:technology.imageUrl
        }
    }

    public static toDomain(raw: any): Technology {
        const slug = Slug.create({value:raw.slug})

        const technologyDomain = Technology.create({
            technologyId:raw.id,
            slug,
            notionPageId: raw.notionPageId,
            name: raw.name,
            imageUrl:raw.imageUrl
        });

        return technologyDomain ? technologyDomain : null;
    }

    //TODO DTO technology response
    public static toResponse(technology: Technology): any {
        const technologyResponse = {
            slug: technology.slug.value,
            name: technology.name,
            icon:technology.imageUrl
        }

        return technologyResponse
    }
}

// Persistence
// model Technology {
//     id   Int    @id @default(autoincrement())
//     slug String @unique
//     notionPageId String @unique
//     name String @unique
//     imageUrl String?
//     courses Course[] @relation(references: [id])
//   }
  

// Domain
// interface TechnologyProps {
//     technologyId: number;
//     name: string;
//     slug: Slug;
//     notionPageId: string
//     imageUrl?: string
// }