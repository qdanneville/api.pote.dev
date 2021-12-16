import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import { Formation } from '../../domain/formation';
import { FormationRepository } from '../../repos/formationRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service';

interface NotionContent {
    formations: Formation[]
}

@Injectable()
export class NotionContentService implements NotionContent {
    formations: Formation[]

    constructor(
        private notionProviderService: NotionProviderService,
        private formationRepository: FormationRepository
    ) {
        this.formations = []
    }

    public async syncFormationsFromNotion() {
        const formations = await this.notionProviderService.getFormations();

        await Promise.all(formations.map(async (formation) => {
            if (formation.isPublished) {
                const formationPage = await this.notionProviderService.getPage(formation.id)
                const formationDetail = formationPage[Object.keys(formationPage)[0]].value

                const formationProps = {
                    slug: formation.slug,
                    notionPageId: formation.id,
                    title: formation.title,
                    imageUrl: formationDetail.format?.page_cover ? formationDetail.format?.page_cover : null,
                }

                const formationDomain = Formation.create(formationProps)
                await this.formationRepository.createOrUpdateFormation(formationDomain)

                this.formations.push(formationDomain)
            }
        }));
    }
}