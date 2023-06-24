import { Controller, Get, Query } from '@nestjs/common';
import { GetCoursesService } from './getCourses.service';

@Controller('courses')
export class GetCoursesController {
    constructor(private readonly getCoursesService: GetCoursesService) { }

    @Get()
    async getCourses(@Query() query) {
        return this.getCoursesService.findAll(query)
    }
}