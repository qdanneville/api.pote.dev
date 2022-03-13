import { Module } from '@nestjs/common';
import { GetCoursesController } from './getCourses.controller'
import { CourseRepository } from '../../repos/courseRepository';
import { GetCoursesService } from './getCourses.service'

@Module({
    providers: [CourseRepository, GetCoursesService],
    controllers: [GetCoursesController],
    exports: [GetCoursesService],
})
export class GetCoursesModule { }