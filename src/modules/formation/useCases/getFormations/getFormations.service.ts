import { Injectable } from '@nestjs/common';
import { FormationMap } from '../../mappers/formationMap';
import { FormationRepository } from '../../repos/formationRepository';

@Injectable()
export class GetFormationsService {
    constructor(private readonly formationRepository: FormationRepository) { }

    async findAll(query) {
        const formationsDomains = await this.formationRepository.getFormations(query)

        return formationsDomains.map(formation => FormationMap.toResponse(formation))
    }
}