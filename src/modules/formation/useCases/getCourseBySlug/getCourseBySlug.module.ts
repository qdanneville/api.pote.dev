import { Module } from '@nestjs/common';
import { CourseRepository } from '../../repos/courseRepository';
import { GetCourseBySlugController } from './getCourseBySlug.controller';
import { GetCourseBySlugService } from './getCourseBySlug.service';

@Module({
    providers: [CourseRepository, GetCourseBySlugService],
    controllers: [GetCourseBySlugController],
    exports: [GetCourseBySlugService],
})
export class GetCourseBySlugModule { }