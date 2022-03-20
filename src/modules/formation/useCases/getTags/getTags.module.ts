import { Module } from '@nestjs/common';
import { TagRepository } from '../../repos/tagRepository';
import { GetTagsService } from './getTags.service';
import { GetTagsController } from './getTags.controller';

@Module({
    providers: [TagRepository, GetTagsService],
    controllers: [GetTagsController],
    exports: [GetTagsService],
})
export class GetTagsModule { }