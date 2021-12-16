import { Controller, Post } from '@nestjs/common';
import { NotionContentService } from './notionContent.service';

@Controller('notion')
export class NotionContentController {
    constructor(private readonly notionContentService: NotionContentService) { }

    @Post('/formations')
    async getAndCreateNotionFormations() {
        return this.notionContentService.syncFormationsFromNotion()
    }
}