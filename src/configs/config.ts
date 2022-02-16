import { Config } from './config.interface';

const config: Config = {
    nest: {
        port: parseInt(process.env.PORT) || 4000,
    },
    cors: {
        enabled: true,
        origin: [process.env.APP_BASE_URL, "https://www.notion.so/"],
        credentials: true
    },
    swagger: {
        enabled: true,
        title: 'pote.dev Swagger',
        description: 'pote.dev | La plateforme pour apprendre à bien coder x)',
        version: '1',
        path: 'api',
    },
    security: {
        expiresIn: parseInt(process.env.JWT_EXPIRE_IN),
        refreshIn: parseInt(process.env.JWT_REFRESH_IN),
        jwtSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        verifyEmailTokenExpiresIn: process.env.VERIFFY_EMAIL_TOKEN_EXPIRES_IN,
        forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
    },
    prefix: {
        forgotPasswordPrefix: process.env.FORGOT_PASSWORD_PREFIX,
        verifyEmailPrefix: process.env.VERIFY_EMAIL_PREFIX
    },
    github: {
        accessTokenUri: process.env.GITHUB_GET_ACCESS_TOKEN_URI,
        userUri: process.env.GITHUB_GET_USER_URI,
        userEmailUri: process.env.GITHUB_GET_USER_EMAIL_URI,
        clientId: process.env.GITHUB_ID,
        secretId: process.env.GITHUB_SECRET,
        redirectUri: process.env.OAUTH_REDIRECT_URI,
        scope: process.env.GITHUB_SCOPE
    },
    notion: {
        notionContentApi: process.env.NOTION_CONTENT_API,
        notionVersionPrefix: process.env.NOTION_VERSION_PREFIX,
        notionVersion: process.env.NOTION_VERSION,
        notionSplitbeeContentApi: process.env.NOTION_SPLITBEE_CONTENT_API,
        notionSecret: process.env.NOTION_SECRET,
        notionToken: process.env.NOTION_TOKEN,
        notionFormationsDatabaseId: process.env.NOTION_FORMATIONS_DATABASE_ID,
        notionCoursesDatabaseId: process.env.NOTION_COURSES_DATABASE_ID,
        notionChaptersDatabaseId: process.env.NOTION_CHAPTERS_DATABASE_ID,
        notionTagsDatabaseId: process.env.NOTION_TAGS_DATABASE_ID,
        notionDifficultiesDatabaseId: process.env.NOTION_DIFFICULTIES_DATABASE_ID,
        notionPrerequisitesDatabaseId: process.env.NOTION_PREREQUISITES_DATABASE_ID,
        notionTechnologiesDatabaseId: process.env.NOTION_TECHNOLOGIES_DATABASE_ID,
    }
};

export default (): Config => config;