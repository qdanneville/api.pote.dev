import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { GetPageDTO } from '../getPage.dto';
import { GetPageService } from './getPage.service';

@Controller('page')
export class GetPageController {
    constructor(private readonly getPageService: GetPageService) { }

    @Get('/:page')
    async function(@Param() params: GetPageDTO) {
        return this.getPageService.find(params)
    }
}