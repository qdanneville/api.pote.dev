import { Module } from '@nestjs/common';
import { ChapterRepository } from '../../repos/chapterRepository';
import { CourseRepository } from '../../repos/courseRepository';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { FormationRepository } from '../../repos/formationRepository';
import { LessonRepository } from '../../repos/lessonRepository';
import { PrerequisiteRepository } from '../../repos/prerequisiteRepository';
import { TagRepository } from '../../repos/tagRepository';
import { TechnologyRepository } from '../../repos/technologyRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service'
import { NotionContentController } from './notionContent.controller';
import { NotionContentService } from './notionContent.service';

@Module({
    providers: [NotionProviderService, NotionContentService, FormationRepository, TagRepository, TechnologyRepository, DifficultyRepository, PrerequisiteRepository, CourseRepository, ChapterRepository, LessonRepository],
    controllers: [NotionContentController],
    exports: [NotionContentService]
})
export class NotionContentModule { }