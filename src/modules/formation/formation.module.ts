import { Module } from '@nestjs/common';

//Services
import { NotionContentModule } from './services/notionContent/notionContent.module';

//UseCases
import { GetPageModule } from './useCases/getPage/getPage.module'
import { GetFormationsModule } from './useCases/getFormations/getFormations.module';
import { GetFormationsBySlugModule } from './useCases/getFormationBySlug/getFormationBySlug.module';

@Module({
    imports: [
        NotionContentModule,
        GetPageModule,
        GetFormationsModule,
        GetFormationsBySlugModule
    ]
})

export class FormationModule { }