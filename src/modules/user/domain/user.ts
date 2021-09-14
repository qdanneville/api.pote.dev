import { MinLength, MaxLength, IsString, IsDefined, IsEmail, IsOptional } from 'class-validator'

interface UserProps {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    lastLogin?: Date;
}

export class User implements UserProps {
    //-------------FIELD-------------
    @IsOptional()
    @IsString()
    public firstname: string

    //-------------FIELD-------------
    @IsOptional()
    @IsString()
    public lastname: string

    //-------------FIELD-------------
    @MinLength(3, {
        message: 'Username is too short',
    })
    @MaxLength(20, {
        message: 'Username is too long',
    })
    @IsDefined({ message: 'Username is required' })
    @IsString()
    public username: string

    //-------------FIELD-------------
    @IsEmail()
    @IsDefined({ message: 'Email is required' })
    public email: string

    //-------------FIELD-------------
    @IsDefined({ message: 'Password is required' })
    @IsString()
    public password: string

    //-------------FIELD-------------
    @IsOptional()
    @IsString()
    public accessToken: string

    //-------------FIELD-------------
    @IsOptional()
    @IsString()
    public refreshToken: string

    //-------------FIELD-------------
    @IsOptional()
    @IsString()
    public lastLogin: Date

    constructor(props: UserProps) {
        console.log('Author props', props);

        const { firstname, lastname, username, email, password } = props;

        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public setAccessToken(accessToken: string, refreshToken: string): void {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.lastLogin = new Date();
    }

    // public static async hashPassword(password: string): Promise<string> {
    //     // return argon2.hash(password)
    // }

    // public static async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    //     // return argon2.verify(hashPassword, password)
    // }

    public static create(props: UserProps): User {
        const user = new User({ ...props })

        console.log('created class user', user)

        return user
    }
}