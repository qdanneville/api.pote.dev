import { Chapter } from '../domain/chapter';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Slug } from '../domain/slug';
import {Course} from '../domain/course'
import { CourseMap } from './courseMap';

export class ChapterMap {
    public static async toPersistence(chapter: Chapter): Promise<any> {

        const data = {
            id: chapter.id.toString(),
            slug: chapter.slug.value,
            notionPageId: chapter.notionPageId,
            title: chapter.title,
            courseId: chapter.course ? chapter.courseId : null,
            // chapterStep: chapter.chapterStep ? chapter.chapterStep.map(chapterStep => ({ id: chapterStep })) : [],
        }

        return data
    }

    public static async toDomain(raw: any): Promise<Chapter> {
        const slug = Slug.create({ value: raw.slug })
        const course:Course = await CourseMap.toDomain(raw.course);
        // const chapterSteps = raw.chapterSteps?.map(chapterStep => ChapterStep.create(chapterStep))

        const chapterDomain = Chapter.create({
            slug,
            notionPageId: raw.notionPageId,
            title: raw.title,
            imageUrl: raw.imageUrl,
            course,
            // chapterSteps
        }, new UniqueEntityID(raw.id));


        return chapterDomain ? chapterDomain : null;
    }

    //TODO DTO Chapter response
    public static toResponse(Chapter: Chapter): any {
        const chapterResponse = {
            slug: Chapter.slug,
            title: Chapter.title,
            imageUrl: Chapter.imageUrl
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