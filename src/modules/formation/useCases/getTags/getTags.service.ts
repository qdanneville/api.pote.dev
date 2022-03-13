import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../repos/TagRepository';
import { TagMap } from '../../mappers/TagMap';

@Injectable()
export class GetTagsService {
    constructor(private readonly tagRepository: TagRepository) { }

    async findAll() {
        const tagsDomain = await this.tagRepository.getTags()

        return tagsDomain.map(tag => TagMap.toResponse(tag))
    }
}