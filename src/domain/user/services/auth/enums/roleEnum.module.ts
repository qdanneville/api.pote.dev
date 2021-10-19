import { Module } from '@nestjs/common';
import { RoleEnumService } from './roleEnum.service';
import { RoleRepository } from '../../../repos/role.repository'

@Module({
    providers: [RoleEnumService, RoleRepository],
    exports: [RoleEnumService],
})
export class RoleEnumModule { }