import { ValueObject } from 'src/core/domain/ValueObject';

interface RoleProps {
    roleId: number;
    name: string;
}

export class UserRole extends ValueObject<RoleProps> {
    get roleId(): number {
        return this.props.roleId;
    }

    get name(): string {
        return this.props.name;
    }

    private constructor(props: RoleProps) {
        super(props);
    }

    public static create(props: RoleProps): UserRole {
        const user = new UserRole({ ...props })

        return user
    }
}