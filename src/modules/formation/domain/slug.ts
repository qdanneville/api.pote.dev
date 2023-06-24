import { ValueObject } from 'src/core/domain/ValueObject';

interface SlugProps {
    value: string;
}

export class Slug extends ValueObject<SlugProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: SlugProps) {
        super(props);
    }

    public static create(props: SlugProps): Slug {


        const isSlugRe = new RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$')

        if (!isSlugRe.test(props.value)) {
            throw new Error(`Slug : ${props.value} - invalid`)
        }

        const slug = new Slug({ ...props })

        return slug
    }
}