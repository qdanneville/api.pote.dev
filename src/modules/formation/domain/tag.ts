import { ValueObject } from 'src/core/domain/ValueObject';
import { Slug } from './slug';

export interface TagProps {
    tagId?: number;
    name: string;
    slug: Slug;
    notionPageId: string
    imageUrl?: string
}

export class Tag extends ValueObject<TagProps> {
    get tagId(): number {
        return this.props.tagId;
    }

    get name(): string {
        return this.props.name;
    }

    get notionPageId(): string {
        return this.props.notionPageId
    }

    get slug(): Slug {
        return this.props.slug;
    }

    get imageUrl(): string {
        return this.props.imageUrl;
    }

    private constructor(props: TagProps) {
        super(props);
    }

    public static create(props: TagProps): Tag {
        const tag = new Tag({ ...props })

        return tag
    }
}