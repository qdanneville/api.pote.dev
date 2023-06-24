import { BadRequestException } from "@nestjs/common";
import { ValueObject } from "../../../core/domain/ValueObject";
import { validate, ValidationError, IsDefined, IsString, MaxLength, MinLength } from 'class-validator'
import { parseClassValidatorErrors } from '../../../utils/parseClassValidatorError'

interface UserUsernameProps {
    value: string;
}

class UsernameValidation {
    //-------------FIELD-------------
    @MinLength(3, {
        message: 'Username is too short',
    })
    @MaxLength(20, {
        message: 'Username is too long',
    })
    @IsDefined({ message: 'Username is required' })
    @IsString()
    username: string

    constructor(username: string) {
        this.username = username
    }
}

export class UserUsername extends ValueObject<UserUsernameProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserUsernameProps) {
        super(props);
    }

    public static async create(username: string): Promise<UserUsername> {
        const usernameErrors = parseClassValidatorErrors(await validate(new UsernameValidation(username)))

        if (!usernameErrors) {
            return new UserUsername({ value: username })
        } else {
            throw new BadRequestException(usernameErrors.message)
        }
    }
}