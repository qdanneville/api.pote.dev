import { ValueObject } from 'src/core/domain/ValueObject';
import { Slug } from './slug';

interface TechnologyProps {
    technologyId: number;
    name: string;
    slug: Slug;
    notionPageId: string
    imageUrl?: string
}

export class Technology extends ValueObject<TechnologyProps> {
    get technologyId(): number {
        return this.props.technologyId;
    }

    get slug(): Slug {
        return this.props.slug;
    }

    get notionPageId(): string {
        return this.props.notionPageId
    }

    get name(): string {
        return this.props.name;
    }

    get imageUrl(): string {
        return this.props.imageUrl;
    }

    private constructor(props: TechnologyProps) {
        super(props);
    }

    public static create(props: TechnologyProps): Technology {
        const technology = new Technology({ ...props })

        return technology
    }
}