import { Module } from '@nestjs/common';

//UseCases
//Auth
import { GetPageModule } from './useCases/getPage/getPage.module'

@Module({
    imports: [
        GetPageModule,
    ]
})

export class FormationModule { }