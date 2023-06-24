import { Injectable } from '@nestjs/common';
import { LessonMap } from '../../mappers/lessonMap';
import { LessonRepository } from '../../repos/lessonRepository';

@Injectable()
export class GetLessonsService {
    constructor(private readonly lessonRepository: LessonRepository) { }

    async findAll() {
        const LessonsDomains = await this.lessonRepository.getLessons()

        return LessonsDomains.map(lesson => LessonMap.toResponse(lesson))
    }
}