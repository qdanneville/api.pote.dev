import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { GetPageDTO } from '../getPage.dto';
import { GetPageService } from './getPage.service';

@Controller('page')
export class GetPageController {
    constructor(private readonly getPageService: GetPageService) { }

    @Get('/:pagelol')
    async function(@Param() params: GetPageDTO) {
        return this.getPageService.find(params)
    }
}