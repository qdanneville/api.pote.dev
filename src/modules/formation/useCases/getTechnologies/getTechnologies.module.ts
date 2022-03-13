import { Module } from '@nestjs/common';
import { TechnologyRepository } from '../../repos/technologyRepository';
import { GetTechnologiesService } from './getTechnologies.service';
import { GetTechnologiesController } from './getTechnologies.controller';

@Module({
    providers: [TechnologyRepository, GetTechnologiesService],
    controllers: [GetTechnologiesController],
    exports: [GetTechnologiesService],
})
export class GetTechnologiesModule { }