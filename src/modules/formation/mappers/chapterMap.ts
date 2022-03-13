import { Chapter } from '../domain/chapter';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import {Course} from '../domain/course'
import { CourseMap } from './courseMap';
import { Lesson } from '../domain/lesson';
import {LessonMap} from './lessonMap'

export class ChapterMap {
    public static async toPersistence(chapter: Chapter): Promise<any> {

        const data = {
            id: chapter.id.toString(),
            slug: chapter.slug.value,
            notionPageId: chapter.notionPageId,
            title: chapter.title,
            courseId: chapter.course ? chapter.courseId : null,
        }

        return data
    }

    public static toDomain(raw: any): Chapter {
        const slug = Slug.create({ value: raw.slug })
        const lessons = raw.lessons?.map(lesson => LessonMap.toDomain(lesson))

        const chapterDomain = Chapter.create({
            slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            imageUrl: raw.imageUrl,
            lessons
        }, new UniqueEntityID(raw.id));


        return chapterDomain ? chapterDomain : null;
    }

    //TODO DTO Chapter response
    public static toResponse(chapter: Chapter): any {

        console.log('chapter to response : ', chapter)
        const chapterResponse = {
            slug: chapter.slug.value,
            title: chapter.title,
            imageUrl: chapter.imageUrl,
            lessons:chapter.lessons.map(lesson => LessonMap.toResponse(lesson))
        }

        return chapterResponse
    }
}

// Persistence
// model Chapter {
//     id       String @id @default(uuid())
//     slug     String @unique
//     title    String @unique
//     notionPageId String @unique
//     order Int? @default(0)
//     duration Int?
  
//     course   Course? @relation(fields: [courseId], references: [id])
//     courseId String?
  
//     Lessons Lesson[]
  
//     createdAt   DateTime      @default(now())
//     updatedAt   DateTime      @updatedAt
//   }

// export interface ChapterProps {
//     slug: Slug,
//     notionPageId: string
//     title: string,
//     imageUrl?: string,
//     duration?: number,
//     course?: Course
// }