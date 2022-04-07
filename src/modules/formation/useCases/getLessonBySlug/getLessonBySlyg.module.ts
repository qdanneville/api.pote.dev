import { Module } from '@nestjs/common';
import { LessonRepository } from '../../repos/lessonRepository';
import { NotionProviderService } from '../../services/notionProvider/notionProvider.service';
import { GetLessonBySlugController } from './getLessonBySlug.controller';
import { GetLessonBySlugService } from './getLessonBySlug.service';

@Module({
    providers: [LessonRepository, GetLessonBySlugService, NotionProviderService],
    controllers: [GetLessonBySlugController],
    exports: [GetLessonBySlugService],
})
export class GetLessonBySlugModule { }