import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'
import { ConfigService } from '@nestjs/config';

interface Notion {
    notionClient: AxiosInstance
    notionBaseUrl: string
    notionPageUrl: string
    notionTableUrl: string
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
    notionCoursesDatabaseId: string
    notionTagsDatabaseId: string
    notionTechnologiesDatabaseId: string
    notionPrerequisitesDatabaseId: string
    notionDifficultiesDatabaseId: string
}

@Injectable()
export class NotionProviderService implements Notion {
    notionClient: AxiosInstance
    notionBaseUrl: string
    notionPageUrl: string
    notionTableUrl: string
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
    notionCoursesDatabaseId: string
    notionChaptersDatabaseId: string
    notionTagsDatabaseId: string
    notionTechnologiesDatabaseId: string
    notionPrerequisitesDatabaseId: string
    notionDifficultiesDatabaseId: string

    constructor(private configService: ConfigService) {
        this.notionBaseUrl = this.configService.get<string>('notion.notionContentApi');
        this.notionPageUrl = 'pages/'
        this.notionTableUrl = 'databases/'
        this.notionSecret = this.configService.get<string>('notion.notionSecret');
        this.notionToken = this.configService.get<string>('notion.notionToken');
        this.notionVersionPrefix = this.configService.get<string>('notion.notionVersionPrefix');
        this.notionVersion = this.configService.get<string>('notion.notionVersion');

        this.notionFormationsDatabaseId = this.configService.get<string>('notion.notionFormationsDatabaseId');
        this.notionCoursesDatabaseId = this.configService.get<string>('notion.notionCoursesDatabaseId');
        this.notionChaptersDatabaseId = this.configService.get<string>('notion.notionChaptersDatabaseId');
        this.notionTagsDatabaseId = this.configService.get<string>('notion.notionTagsDatabaseId');
        this.notionTechnologiesDatabaseId = this.configService.get<string>('notion.notionTechnologiesDatabaseId');
        this.notionPrerequisitesDatabaseId = this.configService.get<string>('notion.notionPrerequisitesDatabaseId');
        this.notionDifficultiesDatabaseId = this.configService.get<string>('notion.notionDifficultiesDatabaseId');

        this.notionClient = axios.create({
            baseURL: this.notionBaseUrl,
            headers: {
                "Authorization": `Bearer ${this.notionSecret}`,
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

    public async getNotionPage(pageId: string) {
        let response;

        try {
            response = await this.notionClient.get(this.notionPageUrl + pageId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Page')
        }

        return response.data ? response.data : null
    }

    public async getSplitBeePage(pageId: string) {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeePageUrl + pageId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with splitbee notion API - Page')
        }

        return response.data ? response.data : null
    }

    public async getSplitBeeTable(tableId: string) {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + tableId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with splitbee notion API - Table')
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

    public async getCourses() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionCoursesDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Courses')
        }

        return response.data ? response.data : null
    }

    public async getChapters() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionChaptersDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Chapters')
        }

        return response.data ? response.data : null
    }

    public async getChapterLessons(chapterId: string) {
        let response;

        try {
            const chapterLessonsDatabaseId = (await this.notionClient.get(`blocks/${chapterId}/children`)).data?.results[0]?.id;
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + chapterLessonsDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Lessons')
        }

        return response.data ? response.data : null
    }

    public async getTags() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionTagsDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Tags')
        }

        return response.data ? response.data : null
    }

    public async getTechnologies() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionTechnologiesDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Technologies')
        }

        return response.data ? response.data : null
    }

    public async getDifficulties() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionDifficultiesDatabaseId)
        }
        catch (err) {
            console.log(err.message)
            throw new BadGatewayException('Something wrong with notion API - Difficulties')
        }

        return response.data ? response.data : null
    }

    public async getPrerequisites() {
        let response;

        try {
            response = await this.splitBeeClient.get(this.splitBeeTableUrl + this.notionPrerequisitesDatabaseId)
        }
        catch (err) {
            console.log(err)
            throw new BadGatewayException('Something wrong with notion API - Prerequisites')
        }

        return response.data ? response.data : null
    }
}