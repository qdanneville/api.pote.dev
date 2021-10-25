import { BadRequestException } from "@nestjs/common";
import { ValueObject } from "../../../core/domain/ValueObject";

interface UserEmailProps {
    value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserEmailProps) {
        super(props);
    }

    public static create(email: string) {
        const isWrongEmail = email.includes('yopmail')

        if (isWrongEmail) {
            throw new BadRequestException("This email format isn't accepted");
        } else {
            return new UserEmail({ value: email })
        }
    }
}