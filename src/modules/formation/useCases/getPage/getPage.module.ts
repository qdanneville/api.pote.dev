import { Module } from '@nestjs/common';
import { GetPageService } from './getPage.service';
import { GetPageController } from './getPage.controller';
import { NotionProviderService } from '../../services/notionProvider/notionProvider.service';

@Module({
    providers: [NotionProviderService, GetPageService],
    controllers: [GetPageController],
    exports: [GetPageService],
})
export class GetPageModule { }