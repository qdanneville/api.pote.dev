import { Course } from '../domain/Course';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import { Difficulty } from '../domain/difficulty';
import { Technology } from '../domain/technology';
import { Tag } from '../domain/Tag';
import { Prerequisite } from '../domain/prerequisite';

export class CourseMap {
    public static async toPersistence(course: Course): Promise<any> {

        const data = {
            id: course.id.toString(),
            slug: course.slug.value,
            notionPageId: course.notionPageId,
            title: course.title,
            imageUrl: course.imageUrl,
            isPublished: course.isPublished,
            difficultyId: course.difficulty ? course.difficultyId : null,
            technologies: course.technologies ? course.technologies.map(technology => ({ id: technology })) : [],
            tags: course.tags ? course.tags.map(tag => ({ id: tag })) : [],
            prerequisites: course.prerequisites ? course.prerequisites.map(prerequisite => ({ id: prerequisite })) : []
        }

        return data
    }

    public static async toDomain(raw: any): Promise<Course> {
        const slug = Slug.create({ value: raw.slug })
        const difficulty = Difficulty.create(raw.difficulty)
        const technologies = raw.technologies?.map(technology => Technology.create(technology))
        const tags = raw.tags?.map(tag => Tag.create(tag))
        const prerequisites = raw.prerequisites?.map(prerequisite => Prerequisite.create(prerequisite))

        const courseDomain = Course.create({
            slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            isPublished: raw.isPublished,
            imageUrl: raw.imageUrl,
            difficulty,
            tags,
            technologies,
            prerequisites
        }, new UniqueEntityID(raw.id));

        return courseDomain ? courseDomain : null;
    }

    //TODO DTO Course response
    public static toResponse(course: Course): any {
        const courseResponse = {
            slug: course.slug,
            title: course.title,
            imageUrl: course.imageUrl
        }

        return courseResponse
    }
}

// Persistence
// model Course {
//     id           String  @id @default(uuid())
//     slug         String  @unique
//     title        String @unique
//     notionPageId String @unique
//     imageUrl     String?
//     duration     Int
//     order        Int? @default(0)
  
//     chapters      Chapter[]
//     prerequisites Prerequisite[] @relation(references: [id])
//     tags          Tag[]          @relation(references: [id])
//     technologies          Technology[]          @relation(references: [id])
  
//     formation   Formation @relation(fields: [formationId], references: [id])
//     formationId String
  
//     diffiulty   Difficulty @relation(fields: [diffiultyId], references: [id])
//     diffiultyId Int
  
//     tryingUsers      User?    @relation("coursesStarted", fields: [tryingUserId], references: [id])
//     successfullUsers      User?    @relation("coursesSucceeded", fields: [successfullUserId], references: [id])
//     tryingUserId    String?
//     successfullUserId String?
  
//     isPublished Boolean @default(false)
  
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }

// export interface CourseProps {
//     title: string
//     slug: Slug
//     notionPageId: string
//     imageUrl?: string
//     tags?: Tag[]
//     technologies?: Technology[]
//     prerequisites?: Prerequisite[]
//     difficulty: Difficulty
//     isPublished: boolean
//     duration?: number
//     order?: number
// }