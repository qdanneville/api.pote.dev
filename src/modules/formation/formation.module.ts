import { Module } from '@nestjs/common';

//Services
import { NotionContentModule } from './services/notionContent/notionContent.module';

//UseCases
import { GetPageModule } from './useCases/getPage/getPage.module'

@Module({
    imports: [
        NotionContentModule,
        GetPageModule,
    ]
})

export class FormationModule { }