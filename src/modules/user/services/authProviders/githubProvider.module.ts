import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { githubProviderService } from './githubProvider.service'

@Module({
    providers: [githubProviderService, ConfigService],
    exports: [githubProviderService]
})
export class githubProviderModule { }