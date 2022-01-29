import { Controller, Post } from '@nestjs/common';
import { NotionContentService } from './notionContent.service';

@Controller('notion')
export class NotionContentController {
    constructor(private readonly notionContentService: NotionContentService) { }

    @Post('/formations')
    async getAndCreateNotionFormations() {
        return this.notionContentService.syncFormationsFromNotion()
    }

    @Post('/courses')
    async getAndCreateNotionCourses() {
        return this.notionContentService.syncCourses()
    }

    @Post('/chapters')
    async getAndCreateNotionChapters() {
        return this.notionContentService.syncChapters()
    }

    @Post('/tags')
    async getAndCreateNotionTags() {
        return this.notionContentService.syncTags()
    }

    @Post('/technologies')
    async getAndCreateNotionTechnologies() {
        return this.notionContentService.syncTechnologies()
    }

    @Post('/difficulties')
    async getAndCreateNotionDifficulties() {
        return this.notionContentService.syncDifficulties()
    }

    @Post('/prerequisites')
    async getAndCreateNotionPrerequisites() {
        return this.notionContentService.syncPrerequisites()
    }
}