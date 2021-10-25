import { Module } from '@nestjs/common';
import { GetCurrentUserController } from './getCurrentUser.controller';

@Module({
    controllers: [GetCurrentUserController],
})
export class GetCurrentUserModule { }