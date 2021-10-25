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

    async getUserByEmail(email: string, skipError: boolean = false, withRole: boolean = false) {
        const user = !withRole ? await this.entities.user.findUnique({
            where: {
                email,
            },
        }) : await this.entities.user.findUnique({
            where: {
                email,
            },
            include: {
                role: true
            }
        });

        if (!user && !skipError) {
            throw new NotFoundException(email);
        }
        return user;
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
            console.log('user before creation : ', rawPrismaUser);
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

    async confirmUser(userId: string) {
        const UserModel = this.entities.user
        return await UserModel.update({
            where: {
                id: userId,
            },
            data: {
                isEmailVerified: true
            }
        })
    }

    deleteUser(id: string) {
        return this.entities.user.delete({
            where: {
                id,
            },
        });
    }
}