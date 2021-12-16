import { Module } from '@nestjs/common';
import { NotionProviderService } from '../../services/notionProvider/notionProvider.service';
import { GetFormations } from './getFormations.service';

@Module({
    providers: [NotionProviderService, GetFormations],
    exports: [GetFormations],
})
export class GetPageModule { }