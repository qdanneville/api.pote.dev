import { Controller, Get, Param, Request } from '@nestjs/common';
import { GetFormationsBySlugService } from './getFormationBySlug.service';

@Controller('formations')
export class GetFormationsBySlugController {
    constructor(private readonly getFormationsBySlugService: GetFormationsBySlugService) { }

    @Get('/:slug')
    async getFormations(@Param() params: string) {
        return this.getFormationsBySlugService.find(params)
    }
}