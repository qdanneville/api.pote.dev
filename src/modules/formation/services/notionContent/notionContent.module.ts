import { Module } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service'
import { NotionContentController } from './notionContent.controller';
import { NotionContentService } from './notionContent.service';

@Module({
    providers: [NotionProviderService, NotionContentService, FormationRepository],
    controllers: [NotionContentController],
    exports: [NotionContentService]
})
export class NotionContentModule { }