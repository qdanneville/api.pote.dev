import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotionProviderService } from './notionProvider.service'

@Module({
    providers: [NotionProviderService, ConfigService],
    exports: [NotionProviderService]
})
export class NotionProviderModule { }