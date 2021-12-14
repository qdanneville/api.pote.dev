import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config';

interface Notion {
    baseUrl: string
    pageUrl: string
    tableUrl: string
    client: AxiosInstance
}

@Injectable()
export class NotionProviderService implements Notion {
    baseUrl: string
    pageUrl: string
    tableUrl: string
    client: AxiosInstance

    constructor(private configService: ConfigService) {
        this.baseUrl = this.configService.get<string>('notion.notionContentApi');
        this.client = axios.create({ baseURL: this.baseUrl })
        this.pageUrl = this.baseUrl + 'page/'
        this.tableUrl = this.baseUrl + 'table/'
    }

    public async getPage(page: string) {
        let response;

        try {
            response = await this.client.get(this.pageUrl + page)
            console.log('Notion API response = ', response)
        }
        catch (err) {
            console.log(err)
            throw new BadGatewayException('Something wrong with notion API')
        }

        return response.data
    }
}