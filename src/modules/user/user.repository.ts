import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service'

@Injectable()
export class UserRepository {
    constructor(private readonly entities: PrismaService) { }

    getUsers() {
        return this.entities.user.findMany();
    }

    async getUserById(id: string) {
        const user = await this.entities.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.entities.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new NotFoundException(email);
        }
        return user;
    }

    async userExists(email: string) {
        const user = await this.entities.user.findUnique({
            where: {
                email,
            },
        });
        return (!!user);
    }

    async createUser(user) {

        const userFound = await this.userExists(user.email)
        console.log('found user ? :', userFound);

        if (userFound) {
            throw new BadRequestException('user already exists');
        }

        return this.entities.user.create({
            data: {
                ...user
            },
        });
    }

    deleteUser(id: string) {
        return this.entities.user.delete({
            where: {
                id,
            },
        });
    }
}