import { User } from '../domain/user';

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

        console.log('user before map', user)

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
}