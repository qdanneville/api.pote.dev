import { Injectable } from '@nestjs/common';
import { CourseMap } from '../../mappers/courseMap';
import { CourseRepository } from '../../repos/courseRepository';

@Injectable()
export class GetCoursesService {
    constructor(private readonly courseRepository: CourseRepository) { }

    async findAll(query) {
        const coursesDomains = await this.courseRepository.getCourses(query)

        return coursesDomains.map(course => CourseMap.toResponse(course))
    }
}