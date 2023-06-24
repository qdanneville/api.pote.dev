import { Injectable } from '@nestjs/common';
import { FormationRepository } from '../../repos/formationRepository';
import { FormationMap } from '../../mappers/formationMap';


@Injectable()
export class GetFormationsBySlugService {
    constructor(private readonly formationRepository: FormationRepository) { }

    async find(params) {

        const formationDomain = await this.formationRepository.getFormationBySlug(params.slug)

        return FormationMap.toFormationDetailResponse(formationDomain)
    }
}