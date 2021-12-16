import { Injectable } from '@nestjs/common';
import { NotionProviderService } from '../../services/notionProvider/notionProvider.service';

@Injectable()
export class GetFormations {
    constructor(private readonly notionProviderService: NotionProviderService) { }

    async find() {
        
    }
}