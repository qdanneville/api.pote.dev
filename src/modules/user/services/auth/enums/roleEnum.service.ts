import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../../repos/role.repository';

@Injectable()
export class RoleEnumService {
    constructor(private readonly roleRepository: RoleRepository) { }

    async enums() {
        const roles = await this.roleRepository.getRoles();

        let roleEnum = {}

        roles.forEach((role) => {
            roleEnum[role.name] = role.name
        })

        return roleEnum
    }
}
