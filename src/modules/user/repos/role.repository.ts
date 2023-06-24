import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'

@Injectable()
export class RoleRepository {
    constructor(private readonly entities: PrismaService) { }

    getRoles() {
        return this.entities.role.findMany();
    }

    async getRoleById(id: number) {
        const role = await this.entities.role.findUnique({
            where: {
                id,
            },
        });
        if (!role) {
            throw new NotFoundException(id);
        }
        return role;
    }

    async getDefaultUserRole() {
        const role = await this.entities.role.findFirst({
            where: {
                name: "user"
            }
        });
        if (!role) {
            throw new NotFoundException('Default user role not found');
        }
        return role;
    }
}