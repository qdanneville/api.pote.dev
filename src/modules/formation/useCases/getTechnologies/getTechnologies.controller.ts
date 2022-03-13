import { Controller, Get, Request } from '@nestjs/common';
import { GetTechnologiesService } from './getTechnologies.service';

@Controller('technologies')
export class GetTechnologiesController {
    constructor(private readonly getTechnologiesService: GetTechnologiesService) { }

    @Get('')
    async getTechnologies(@Request() req) {
        return this.getTechnologiesService.findAll()
    }
}