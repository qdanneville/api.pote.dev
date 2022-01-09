import { ValueObject } from 'src/core/domain/ValueObject';

export interface PrerequisiteProps {
    prerequisiteId?: number;
    name: string;
    notionPageId: string
    description: string;
}

export class Prerequisite extends ValueObject<PrerequisiteProps> {
    get prerequisiteId(): number {
        return this.props.prerequisiteId;
    }

    get name(): string {
        return this.props.name;
    }

    get notionPageId(): string {
        return this.props.notionPageId
    }

    get description(): string {
        return this.props.description;
    }

    private constructor(props: PrerequisiteProps) {
        super(props);
    }

    public static create(props: PrerequisiteProps): Prerequisite {
        const prerequisite = new Prerequisite({ ...props })

        return prerequisite
    }
}