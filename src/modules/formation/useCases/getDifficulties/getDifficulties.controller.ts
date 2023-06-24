import { Controller, Get, Request } from '@nestjs/common';
import { GetDifficultiesService } from './getDifficulties.service';

@Controller('difficulties')
export class GetDifficultiesController {
    constructor(private readonly getDifficultiesService: GetDifficultiesService) { }

    @Get('')
    async getDifficulties(@Request() req) {
        return await this.getDifficultiesService.findAll()
    }
}