import { Tag } from '../domain/tag';
import { Slug } from '../domain/slug';

export class TagMap {
    public static async toPersistence(tag: Tag): Promise<any> {

        return {
            id: tag.tagId,
            slug: tag.slug.value,
            notionPageId: tag.notionPageId,
            name: tag.name,
            imageUrl:tag.imageUrl
        }
    }

    public static toDomain(raw: any): Tag {
        const slug = Slug.create({value:raw.slug})

        const tagDomain = Tag.create({
            tagId:raw.id,
            slug,
            notionPageId: raw.notionPageId,
            name: raw.name,
            imageUrl:raw.imageUrl
        });

        return tagDomain ? tagDomain : null;
    }

    //TODO DTO Tag response
    public static toResponse(tag: Tag): any {
        const tagResponse = {
            slug: tag.slug.value,
            name: tag.name,
            icon:tag.imageUrl
        }

        return tagResponse
    }
}

// Persistence
// model Tag {
//     id   Int    @id @default(autoincrement())
//     slug String @unique
//     notionPageId String @unique
//     name String @unique
//     imageUrl String?
  
//     courses Course[] @relation(references: [id])
//   }

// Domain
// interface TagProps {
//     tagId: number;
//     name: string;
//     slug: Slug;
//     notionPageId: string
//     imageUrl?: string
// }