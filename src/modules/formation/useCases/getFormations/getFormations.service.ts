import { Injectable } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';

@Injectable()
export class GetFormationsService {
    constructor(private readonly formationRepository: FormationRepository) { }

    async findAll() {
        return this.formationRepository.getFormations()
    }
}