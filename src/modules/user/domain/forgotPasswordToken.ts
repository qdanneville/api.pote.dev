import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { ValueObject } from 'src/core/domain/ValueObject';

export interface ForgotPasswordTokenProps {
    value: string;
    date: Date;
}

export interface ForgotPasswordTokenClaim {
    userId: UniqueEntityID
    token: string
}

export class ForgotPasswordToken extends ValueObject<ForgotPasswordTokenProps> {

    get value(): string {
        return this.props.value;
    }

    get date(): Date {
        return this.props.date;
    }

    private constructor(props: ForgotPasswordTokenProps) {
        super(props);
    }

    public static create(props: ForgotPasswordTokenProps): ForgotPasswordToken {
        const forgotPasswordToken = new ForgotPasswordToken({ ...props })

        return forgotPasswordToken
    }
}