import { Injectable } from '@nestjs/common';
import { LessonRepository } from '../../repos/lessonRepository';
import { LessonMap } from '../../mappers/lessonMap';
import { NotionProviderService } from '../../services/notionProvider/notionProvider.service';


@Injectable()
export class GetLessonBySlugService {
    constructor(
        private readonly lessonRepository: LessonRepository,
        private notionProviderService: NotionProviderService,

    ) { }

    async find(params) {
        const lessonDomain = await this.lessonRepository.getLessonBySlug(params.slug)
        const lessonNotionPage = await this.notionProviderService.getSplitBeePage(lessonDomain.notionPageId)

        lessonDomain.notionContent = lessonNotionPage

        return LessonMap.toResponse(lessonDomain)
    }
}