import { Module } from '@nestjs/common';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { GetDifficultiesController } from './getDifficulties.controller';
import { GetDifficultiesService } from './getDifficulties.service';

@Module({
    providers: [DifficultyRepository, GetDifficultiesService],
    controllers: [GetDifficultiesController],
    exports: [GetDifficultiesService],
})
export class GetDifficultiesModule { }