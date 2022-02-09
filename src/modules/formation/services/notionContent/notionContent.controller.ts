import { Controller, Post, UseGuards } from '@nestjs/common';
import { NotionContentService } from './notionContent.service';
import { Roles } from '../../../user/services/auth/decorators/roles.decorator'
import { Role } from '../../../user/services/auth/enums/role.enum';
import { ConfirmedGuard } from '../../../user/services/auth/guards/confirmed.guard';
import { RolesGuard } from '../../../user/services/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../user/services/auth/guards/jwt-auth.guard';

@Controller('notion')
export class NotionContentController {
    constructor(private readonly notionContentService: NotionContentService) { }

    @Post('/content')
    @Roles(Role.admin)
    @UseGuards(JwtAuthGuard, ConfirmedGuard, RolesGuard)
    async getAndCreateNotionContent() {
        return this.notionContentService.syncContentFromNotion()
    }

    @Post('/formations')
    async getAndCreateNotionFormations() {
        return this.notionContentService.syncFormations()
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