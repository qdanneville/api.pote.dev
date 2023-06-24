import { Controller, Get, Query } from '@nestjs/common';
import { GetFormationsService } from './getFormations.service';

@Controller('formations')
export class GetFormationsController {
    constructor(private readonly getFormationsService: GetFormationsService) { }

    @Get()
    async getFormations(@Query() query) {
        return this.getFormationsService.findAll(query)
    }
}