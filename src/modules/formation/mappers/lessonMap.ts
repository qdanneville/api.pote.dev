import { Lesson } from '../domain/lesson';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import { Chapter } from '../domain/chapter';
import { ChapterMap } from './chapterMap';

export class LessonMap {
    public static async toPersistence(lesson: Lesson): Promise<any> {

        const data = {
            id: lesson.id.toString(),
            slug: lesson.slug.value,
            notionPageId: lesson.notionPageId,
            title: lesson.title,
            imageUrl: lesson.imageUrl,
            chapterId: lesson.chapter ? lesson.chapter.id.toString() : null,
        }

        return data
    }

    public static toDomain(raw: any): Lesson {
        const slug = Slug.create({ value: raw.slug })

        const lessonDomain = Lesson.create({
            slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            imageUrl: raw.imageUrl,
        }, new UniqueEntityID(raw.id));

        return lessonDomain ? lessonDomain : null;
    }

    //TODO DTO Lesson response
    public static toResponse(lesson: Lesson): any {
        const lessonResponse = {
            slug: lesson.slug.value,
            title: lesson.title,
            imageUrl: lesson.imageUrl,
            notionContent: lesson.notionContent
        }

        return lessonResponse
    }
}

// Persistence
// model Lesson {
//     id           String  @id @default(uuid())
//     slug         String  @unique
//     title        String
//     notionPageId String @unique
//     imageUrl     String?
//     duration     Int?
//     order Int @default(0)
  
//     chapter   Chapter? @relation(fields: [chapterId], references: [id])
//     chapterId String?
  
//     createdAt   DateTime      @default(now())
//     updatedAt   DateTime      @updatedAt
//   }

// export interface LessonProps {
//     title: string;
//     slug: Slug;
//     notionPageId: string
//     imageUrl?: string
//     duration?: number
//     order?: number
//     chapter: Chapter
// }