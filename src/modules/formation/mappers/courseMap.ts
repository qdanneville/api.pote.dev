import { Course } from '../domain/course';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import { Difficulty } from '../domain/difficulty';
import { Technology } from '../domain/technology';
import { Tag } from '../domain/tag';
import { Prerequisite } from '../domain/prerequisite';
import { TagMap } from './tagMap';
import { PrerequisiteMap } from './prerequisiteMap';
import { TechnologyMap } from './technologyMap';
import { DifficultyMap } from './difficultyMap';
import { Chapter } from '../domain/chapter';
import { ChapterMap } from './chapterMap';

export class CourseMap {
    public static async toPersistence(course: Course): Promise<any> {

        const data = {
            id: course.id.toString(),
            slug: course.slug.value,
            description: course.description,
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

    public static toDomain(raw: any): Course {
        const slug = Slug.create({ value: raw.slug })
        const difficulty: Difficulty = DifficultyMap.toDomain(raw.difficulty)
        const technologies: Technology[] = raw.technologies?.map(technology => TechnologyMap.toDomain(technology))
        const tags: Tag[] = raw.tags?.map(tag => TagMap.toDomain(tag))
        const prerequisites: Prerequisite[] = raw.prerequisites?.map(prerequisite => PrerequisiteMap.toDomain(prerequisite))
        const chapters: Chapter[] = raw.chapters?.map(chapter => ChapterMap.toDomain(chapter))

        const courseDomain = Course.create({
            slug,
            description: raw.description,
            notionPageId: raw.notionPageId,
            title: raw.title,
            isPublished: raw.isPublished,
            imageUrl: raw.imageUrl,
            difficulty,
            tags,
            technologies,
            prerequisites,
            chapters
        }, new UniqueEntityID(raw.id));

        return courseDomain ? courseDomain : null;
    }

    //TODO DTO Course response
    public static toResponse(course: Course): any {
        const courseResponse = {
            slug: course.slug.value,
            description: course.description,
            title: course.title,
            imageUrl: course.imageUrl,
            difficulty: course.difficulty.name,
            technologies: course.technologies?.map(technology => technology.name),
            prerequisites: course.prerequisites?.map(prerequisite => prerequisite.name),
            tags: course.tags?.map(tag => TagMap.toResponse(tag)),
            chapters:course.chapters?.map(chapter => (ChapterMap.toResponse(chapter))),
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