import { Injectable } from '@nestjs/common';
import { GetPageDTO } from '../getPage.dto';
import { NotionProviderService } from '../../services/notion/notionProvider.service';

@Injectable()
export class GetPageService {
    constructor(private readonly notionProviderService: NotionProviderService) { }

    async find(request: GetPageDTO) {
        const { page } = request

        console.log('page id :', page)

        const pageContent = await this.notionProviderService.getPage(page)
        console.log('page Content : ', pageContent);

        return pageContent
    }
}