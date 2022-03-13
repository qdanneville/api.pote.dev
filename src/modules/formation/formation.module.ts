import { Module } from '@nestjs/common';

//Services
import { NotionContentModule } from './services/notionContent/notionContent.module';

//UseCases
import { GetPageModule } from './useCases/getPage/getPage.module'
import { GetFormationsModule } from './useCases/getFormations/getFormations.module';
import { GetFormationsBySlugModule } from './useCases/getFormationBySlug/getFormationBySlug.module';
import { GetDifficultiesModule } from './useCases/getDifficulties/getDifficulties.module';
import { GetTechnologiesModule } from './useCases/getTechnologies/getTechnologies.module';
import { GetCoursesModule } from './useCases/getCourses/getCourses.module';
import { GetCourseBySlugModule } from './useCases/getCourseBySlug/getCourseBySlug.module';
import { GetTagsModule } from './useCases/getTags/getTags.module';

@Module({
    imports: [
        NotionContentModule,
        GetPageModule,
        GetFormationsModule,
        GetCoursesModule,
        GetCourseBySlugModule,
        GetFormationsBySlugModule,
        GetDifficultiesModule,
        GetTechnologiesModule,
        GetTagsModule
    ]
})

export class FormationModule { }