import { Injectable } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';

@Injectable()
export class GetFormationsBySlugService {
    constructor(private readonly formationRepository: FormationRepository) { }

    async find(params) {
        console.log('params : ', params)
        return this.formationRepository.getFormationBySlug(params.slug)
    }
}