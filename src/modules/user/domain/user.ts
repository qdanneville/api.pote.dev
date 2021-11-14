import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { UserId } from "./userId";
import { UserEmail } from "./userEmail";
import { UserUsername } from "./userUsername";
import { UserRole } from "./userRole";
import { UserPassword } from "./userPassword";
import { AccessToken } from "./accessToken";
import { RefreshToken } from './refreshToken'

//Events
import { UserCreatedEvent } from "./events/userCreatedEvent";
import { UserLoggedIn } from "./events/userLoggedIn"
import { UserDeleted } from "./events/userDeleted"


interface UserProps {
    email: UserEmail;
    username: UserUsername;
    password: UserPassword;
    isEmailVerified?: boolean;
    isAdmin?: boolean;
    accessToken?: AccessToken;
    refreshToken?: RefreshToken;
    role: UserRole;
    lastLogin?: Date;
    isDeleted?: boolean
}

export class User extends AggregateRoot<UserProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get userId(): UserId {
        return UserId.caller(this.id)
    }

    get email(): UserEmail {
        return this.props.email;
    }

    get username(): UserUsername {
        return this.props.username;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get isEmailVerified(): boolean {
        return this.props.isEmailVerified;
    }

    get isAdmin(): boolean {
        return this.props.isAdmin;
    }

    get isDeleted(): boolean {
        return this.props.isDeleted;
    }

    get accessToken(): AccessToken {
        return this.props.accessToken
    }

    get refreshToken(): RefreshToken {
        return this.props.refreshToken
    }

    get role(): UserRole {
        return this.props.role
    }

    get roleName(): string {
        return this.props.role.name
    }

    get roleId(): number {
        return this.props.role.roleId
    }

    get lastLogin(): Date {
        return this.props.lastLogin;
    }

    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public setAccessToken(accessToken: AccessToken, refreshToken: RefreshToken): void {
        this.addDomainEvent(new UserLoggedIn(this));
        this.props.accessToken = accessToken;
        this.props.refreshToken = refreshToken;
        this.props.lastLogin = new Date();
    }

    public delete(): void {
        if (!this.props.isDeleted) {
            this.addDomainEvent(new UserDeleted(this));
            this.props.isDeleted = true;
        }
    }


    public static create(props: UserProps, id?: UniqueEntityID): User {

        const user = new User({
            ...props,
            isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
            isAdmin: props.isAdmin ? props.isAdmin : false,
        }, id);

        const idWasProvided = !!id;

        if (!idWasProvided) {
            user.addDomainEvent(new UserCreatedEvent(user));
        }

        return user;
    }
}