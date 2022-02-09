import { BadGatewayException, BadRequestException } from "@nestjs/common";
import { ValueObject } from "../../../core/domain/ValueObject";
import argon2 from 'argon2'

interface UserPasswordProps {
    value: string;
    hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {

    get value(): string {
        return this.props.value;
    }

    get hashed(): boolean {
        return this.props.hashed;
    }

    private constructor(props) {
        super(props)
    }

    /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

    public async comparePassword(plainTextPassword: string): Promise<boolean> {
        let hashed: string;
        if (this.isAlreadyHashed()) {
            hashed = this.props.value;
            return await this.argon2Compare(plainTextPassword, hashed);
        } else {
            return this.props.value === plainTextPassword;
        }
    }

    private async argon2Compare(plainText: string, hashed: string): Promise<boolean> {
        return await argon2.verify(hashed, plainText);
    }

    public isAlreadyHashed(): boolean {
        return this.props.hashed;
    }

    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public getHashedValue(): Promise<string> {
        return new Promise((resolve) => {
            if (this.isAlreadyHashed()) {
                return resolve(this.props.value);
            } else {
                return resolve(this.hashPassword(this.props.value))
            }
        })
    }

    public static isAppropriateLength(value: string): boolean {
        return value.length >= 6;
    }

    public static create(props: UserPasswordProps): UserPassword {
        if (!props.hashed) {
            if (!this.isAppropriateLength(props.value)
            ) {
                throw new BadRequestException('Password doesnt meet criteria [1 uppercase, 1 lowercase, one digit or symbol and 8 chars min].')
            }
        }

        return new UserPassword(new UserPassword({
            value: props.value,
            hashed: !!props.hashed === true
        }))
    }
}