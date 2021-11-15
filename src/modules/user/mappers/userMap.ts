import { User } from '../domain/user';
import { UserEmail } from '../domain/userEmail';
import { UserPassword } from '../domain/userPassword';
import { UserUsername } from '../domain/userUsername';
import { UserRole } from '../domain/userRole';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { userResponseDTO } from '../dtos/user.dto';

export class UserMap {
    public static async toPersistence(user: User): Promise<any> {
        let password: string = null;
        if (!!user.password === true) {
            if (user.password.isAlreadyHashed()) {
                password = user.password.value;
            } else {
                password = await user.password.getHashedValue();
            }
        }

        return {
            id: user.id.toString(),
            email: user.email.value,
            isEmailVerified: user.isEmailVerified,
            username: user.username.value,
            password: password,
            isAdmin: user.isAdmin,
            roleId: user.roleId
        }
    }

    public static async toDomain(raw: any): Promise<User> {
        const userNameDomain = await UserUsername.create(raw.username);
        const userPasswordDomain = UserPassword.create({ value: raw.password, hashed: true });
        const userEmailDomain = UserEmail.create(raw.email);
        const userRole = UserRole.create(raw.role);

        const userDomain = User.create({
            username: userNameDomain,
            isAdmin: raw.isAdmin,
            isDeleted: raw.is_deleted,
            isEmailVerified: raw.isEmailVerified,
            password: userPasswordDomain,
            email: userEmailDomain,
            role: userRole
        }, new UniqueEntityID(raw.id));

        return userDomain ? userDomain : null;
    }

    public static toResponse(user: User): userResponseDTO {
        console.log(user);

        const userReponse = {
            username: user.username.value,
            email: user.email.value,
            lastLogin: user.lastLogin,
            isEmailVerified: user.isEmailVerified,
            role: user.role.name
        }

        return userReponse
    }
}

// Persistence
// model User {
//   id        String   @id @default(uuid())
//   username  String   @unique
//   email     String   @unique
//   password  String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   isEmailVerified Boolean  @default(false)
//   isAdmin Boolean

//   role   Role? @relation(fields: [roleId], references: [id])
//   roleId Int? @default(1)
// }

// Domain
// interface UserProps {
//     email: UserEmail;
//     username: UserUsername;
//     password: UserPassword;
//     isEmailVerified?: boolean;
//     isAdmin?: boolean;
//     accessToken?: AccessToken;
//     refreshToken?: RefreshToken;
//     role: UserRole;
//     lastLogin?: Date;
//     isDeleted?: boolean
// }