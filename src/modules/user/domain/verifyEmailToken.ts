import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { ValueObject } from 'src/core/domain/ValueObject';

export interface VerifyEmailTokenProps {
    value: string;
    date: Date;
}

export interface VerifyEmailTokenClaim {
    userId: UniqueEntityID
    token: string
}

export class VerifyEmailToken extends ValueObject<VerifyEmailTokenProps> {

    get value(): string {
        return this.props.value;
    }

    get date(): Date {
        return this.props.date;
    }

    private constructor(props: VerifyEmailTokenProps) {
        super(props);
    }

    public static create(props: VerifyEmailTokenProps): VerifyEmailToken {
        const verifyEmailToken = new VerifyEmailToken({ ...props })

        return verifyEmailToken
    }
}