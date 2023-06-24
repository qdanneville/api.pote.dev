import { Controller, Get, Request } from '@nestjs/common';
import { GetTagsService } from './getTags.service';

@Controller('tags')
export class GetTagsController {
    constructor(private readonly getTagsService: GetTagsService) { }

    @Get('')
    async getTags(@Request() req) {
        return this.getTagsService.findAll()
    }
}