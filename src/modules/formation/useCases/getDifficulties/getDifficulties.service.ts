import { Injectable } from '@nestjs/common';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { DifficultyMap } from '../../mappers/difficultyMap';

@Injectable()
export class GetDifficultiesService {
    constructor(private readonly difficultyRepository: DifficultyRepository) { }

    async findAll() {
        const difficultiesDomain = await this.difficultyRepository.getDifficulties()

        return difficultiesDomain.map(difficulty => DifficultyMap.toResponse(difficulty))
    }
}