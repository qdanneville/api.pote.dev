import { Controller, Get, Param, Request } from '@nestjs/common';
import { GetCourseBySlugService } from './getCourseBySlug.service';

@Controller('courses')
export class GetCourseBySlugController {
    constructor(private readonly getCourseBySlugService: GetCourseBySlugService) { }

    @Get('/:slug')
    async getCourse(@Param() params: string) {
        return this.getCourseBySlugService.find(params)
    }
}