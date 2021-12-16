import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config';

interface Notion {
    notionClient: AxiosInstance
    notionBaseUrl: string
    notionDatabaseUrl: string
    notionVersionPrefix: string
    notionVersion: string
    notionSecret: string
    notionToken: string
    splitBeeClient: AxiosInstance
    splitBeebaseUrl: string
    splitBeePageUrl: string
    splitBeeTableUrl: string
    notionFormationsDatabaseId: string
}

@Injectable()
export class NotionProviderService implements Notion {
    notionClient: AxiosInstance
    notionBaseUrl: string
    notionDatabaseUrl: string
    notionVersionPrefix: string
    notionVersion: string
    notionSecret: string
    notionToken: string
    splitBeeClient: AxiosInstance
    splitBeebaseUrl: string
    splitBeePageUrl: string
    splitBeeTableUrl: string
    notionFormationsDatabaseId: string

    constructor(private configService: ConfigService) {
        this.notionBaseUrl = this.configService.get<string>('notion.notionContentApi');
        this.notionSecret = this.configService.get<string>('notion.notionSecret');
        this.notionToken = this.configService.get<string>('notion.notionToken');
        this.notionVersionPrefix = this.configService.get<string>('notion.notionVersionPrefix');
        this.notionVersion = this.configService.get<string>('notion.notionVersion');
        this.notionFormationsDatabaseId = this.configService.get<string>('notion.notionFormationsDatabaseId');

        this.notionClient = axios.create({
            baseURL: this.notionBaseUrl,
            headers: {
                "Authorization": `Bearer ${this.notionToken}`,
                "Notion-version": this.notionVersion
            }
        })

        this.splitBeebaseUrl = this.configService.get<string>('notion.notionSplitbeeContentApi');
        this.splitBeePageUrl = 'page/'
        this.splitBeeTableUrl = 'table/'

        this.splitBeeClient = axios.create({
            baseURL: this.splitBeebaseUrl,
            headers: {
                "Authorization": `Bearer ${this.notionToken}`,
                "Notion-version": this.notionVersion
            }
        })
    }

    public async getPage(page: string) {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeePageUrl + page)
            // console.log('Notion API page response = ', response)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Page')
        }

        return response.data ? response.data : null
    }

    public async getFormations() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionFormationsDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Formation')
        }

        return response.data ? response.data : null
    }
}