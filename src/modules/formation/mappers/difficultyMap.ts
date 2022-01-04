import { Difficulty } from '../domain/difficulty';
import { Slug } from '../domain/slug';

export class DifficultyMap {
    public static async toPersistence(difficulty: Difficulty): Promise<any> {

        return {
            id: difficulty.difficultyId,
            slug: difficulty.slug.value,
            notionPageId: difficulty.notionPageId,
            name: difficulty.name,
            imageUrl:difficulty.imageUrl
        }
    }

    public static async toDomain(raw: any): Promise<Difficulty> {
        const slug = Slug.create({value:raw.slug})

        const difficultyDomain = Difficulty.create({
            difficultyId:raw.id,
            slug,
            notionPageId: raw.notionPageId,
            name: raw.name,
            imageUrl:raw.imageUrl
        });

        return difficultyDomain ? difficultyDomain : null;
    }

    //TODO DTO difficulty response
    public static toResponse(difficulty: Difficulty): any {
        const difficultyResponse = {
            slug: difficulty.slug,
            name: difficulty.name,
            icon: difficulty.imageUrl
        }

        return difficultyResponse
    }
}

// Persistence
// model Difficulty {
//     id       Int     @id @default(autoincrement())
//     slug     String  @unique
//     notionPageId String @unique
//     name     String  @unique
//     imageUrl String?
  
//     courses Course[]
//   }
  

// Domain
// interface DifficultyProps {
//     difficultyId?: number;
//     name: string;
//     slug: Slug;
//     notionPageId: string
//     imageUrl?: string
// }