import { Module } from '@nestjs/common';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { FormationRepository } from '../../repos/formationRepository';
import { TagRepository } from '../../repos/tagRepository';
import { technologyRepository } from '../../repos/technologyRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service'
import { NotionContentController } from './notionContent.controller';
import { NotionContentService } from './notionContent.service';

@Module({
    providers: [NotionProviderService, NotionContentService, FormationRepository, TagRepository, technologyRepository, DifficultyRepository],
    controllers: [NotionContentController],
    exports: [NotionContentService]
})
export class NotionContentModule { }