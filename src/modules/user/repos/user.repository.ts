import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service'
import { User } from '../domain/user';
import { UserEmail } from '../domain/userEmail';
import { UserMap } from '../mappers/userMap';

@Injectable()
export class UserRepository {
    constructor(private readonly entities: PrismaService) { }

    getUsers() {
        return this.entities.user.findMany();
    }

    async getUserById(id: string): Promise<User> {
        const UserModel = this.entities.user

        const user = await UserModel.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return UserMap.toDomain(user);;
    }

    async getUserByEmail(email: UserEmail): Promise<User> {
        const UserModel = this.entities.user
        const user = await UserModel.findUnique({
            where: {
                email: email.value,
            },
            include: {
                role: true
            }
        });

        if (!user) {
            throw new NotFoundException('User email not found');
        }

        return UserMap.toDomain(user);
    }

    async exists(email: UserEmail) {
        const user = await this.entities.user.findUnique({
            where: {
                email: email.value,
            },
        });
        return (!!user);
    }

    async getUserByUserName(username: string) {
        const user = await this.entities.user.findUnique({
            where: {
                username,
            },
        });
        return (!!user);
    }

    async createUser(user: User) {
        const UserModel = this.entities.user
        const exists = await this.exists(user.email)

        if (!exists) {
            const rawPrismaUser = await UserMap.toPersistence(user)
            await UserModel.create({
                data: {
                    ...rawPrismaUser,
                },
            });
        }

        return
    }

    async changePassword(userId: string, password: string) {
        return await this.entities.user.update({
            where: {
                id: userId,
            },
            data: {
                password,
            },
        })
    }

    async confirmUser(userId: string): Promise<User> {
        const UserModel = this.entities.user
        const user = await UserModel.update({
            where: {
                id: userId,
            },
            data: {
                isEmailVerified: true
            }
        })

        return UserMap.toDomain(user);
    }

    deleteUser(id: string) {
        return this.entities.user.delete({
            where: {
                id,
            },
        });
    }
}