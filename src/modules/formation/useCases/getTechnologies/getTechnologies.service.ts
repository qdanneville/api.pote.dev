import { Injectable } from '@nestjs/common';
import { TechnologyRepository } from '../../repos/technologyRepository';
import { TechnologyMap } from '../../mappers/technologyMap';

@Injectable()
export class GetTechnologiesService {
    constructor(private readonly technologyRepository: TechnologyRepository) { }

    async findAll() {
        const technologiesDomain = await this.technologyRepository.getTechnologies()

        return technologiesDomain.map(technology => TechnologyMap.toResponse(technology))
    }
}