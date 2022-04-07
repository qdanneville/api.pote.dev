import { Controller, Get, Param, Request } from '@nestjs/common';
import { GetLessonBySlugService } from './getLessonBySlug.service';

@Controller('lessons')
export class GetLessonBySlugController {
    constructor(private readonly getLessonBySlugService: GetLessonBySlugService) { }

    @Get('/:slug')
    async getLesson(@Param() params: string) {
        return this.getLessonBySlugService.find(params)
    }
}