import { Module } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';
import { GetFormationsBySlugController } from './getFormationBySlug.controller';
import { GetFormationsBySlugService } from './getFormationBySlug.service';

@Module({
    providers: [FormationRepository, GetFormationsBySlugService],
    controllers: [GetFormationsBySlugController],
    exports: [GetFormationsBySlugService],
})
export class GetFormationsBySlugModule { }