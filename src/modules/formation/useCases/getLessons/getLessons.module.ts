import { Module } from '@nestjs/common';
import { LessonRepository } from '../../repos/lessonRepository';
import { GetLessonsController } from './getLessons.controller';
import { GetLessonsService } from './getLessons.service';

@Module({
    providers: [LessonRepository, GetLessonsService],
    controllers: [GetLessonsController],
    exports: [GetLessonsService],
})
export class GetLessonsModule { }