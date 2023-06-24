import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../../repos/courseRepository';
import { CourseMap } from '../../mappers/courseMap';


@Injectable()
export class GetCourseBySlugService {
    constructor(private readonly courseRepository: CourseRepository) { }

    async find(params) {

        const courseDomain = await this.courseRepository.getCourseBySlug(params.slug)

        return CourseMap.toResponse(courseDomain)
    }
}