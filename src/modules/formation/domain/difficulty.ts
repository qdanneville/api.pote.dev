import { ValueObject } from 'src/core/domain/ValueObject';
import { Slug } from './slug';

interface DifficultyProps {
    difficultyId: number;
    name: string;
    slug: Slug;
    notionPageId: string
    imageUrl?: string
}

export class Difficutly extends ValueObject<DifficultyProps> {
    get difficultyId(): number {
        return this.props.difficultyId;
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

    private constructor(props: DifficultyProps) {
        super(props);
    }

    public static create(props: DifficultyProps): Difficutly {
        const difficulty = new Difficutly({ ...props })

        return difficulty
    }
}