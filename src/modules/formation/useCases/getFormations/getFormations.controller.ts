import { Controller, Get, Request } from '@nestjs/common';
import { GetFormationsService } from './getFormations.service';

@Controller('formations')
export class GetFormationsController {
    constructor(private readonly getFormationsService: GetFormationsService) { }

    @Get('')
    async getFormations(@Request() req) {
        return this.getFormationsService.findAll()
    }
}