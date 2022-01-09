import { Prerequisite } from '../domain/prerequisite';
import { Slug } from '../domain/slug';

export class PrerequisiteMap {
    public static async toPersistence(prerequisite: Prerequisite): Promise<any> {

        return {
            id: prerequisite.prerequisiteId,
            notionPageId: prerequisite.notionPageId,
            name: prerequisite.name,
            description: prerequisite.description,
        }
    }

    public static async toDomain(raw: any): Promise<Prerequisite> {
        const prerequisiteDomain = Prerequisite.create({
            prerequisiteId:raw.id,
            notionPageId: raw.notionPageId,
            name: raw.name,
            description: raw.description,
        });

        return prerequisiteDomain ? prerequisiteDomain : null;
    }

    //TODO DTO Prerequisite response
    public static toResponse(prerequisite: Prerequisite): any {
        const prerequisiteResponse = {
            name: prerequisite.name,
            description: prerequisite.description,
        }

        return prerequisiteResponse
    }
}

// Persistence
// model Prerequisite {
//     id          Int     @id @default(autoincrement())
//     name        String  @unique
//     notionPageId String @unique
//     description String?
//     courses Course[] @relation(references: [id])
//   }
  
// interface PrerequisiteProps {
//     prerequisiteId: number;
//     name: string;
//     notionPageId: string
//     description: string;
// }