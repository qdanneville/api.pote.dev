import { Module } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';
import { GetFormationsController } from './getFormations.controller';
import { GetFormationsService } from './getFormations.service';

@Module({
    providers: [FormationRepository, GetFormationsService],
    controllers: [GetFormationsController],
    exports: [GetFormationsService],
})
export class GetFormationsModule { }