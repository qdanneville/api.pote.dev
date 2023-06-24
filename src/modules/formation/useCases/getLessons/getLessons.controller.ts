import { Controller, Get } from '@nestjs/common';
import { GetLessonsService } from './getLessons.service';

@Controller('lessons')
export class GetLessonsController {
    constructor(private readonly getlessonsService: GetLessonsService) { }

    @Get()
    async getlessons() {
        return this.getlessonsService.findAll()
    }
}