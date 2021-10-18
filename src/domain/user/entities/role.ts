import { MinLength, MaxLength, IsString, IsDefined, IsEmail, IsOptional, IsNumber } from 'class-validator'

interface RoleProps {
    id: number;
    name: string;
}

export class Role implements RoleProps {
    //-------------FIELD-------------
    @IsNumber()
    public id: number

    //-------------FIELD-------------
    @IsString()
    public name: string

    constructor(props: RoleProps) {
        const { id, name } = props;

        this.id = id;
        this.name = name;
    }

    public static create(props: RoleProps): Role {
        const user = new Role({ ...props })

        return user
    }
}