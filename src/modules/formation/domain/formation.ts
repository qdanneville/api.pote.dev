import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Course } from "./course";
import { Difficulty } from "./difficulty";
import { FormationCreated } from "./events/formationCreated";
import { FormationId } from "./FormationId";
import { Slug } from "./slug";
import { Technology } from "./technology";

export interface FormationProps {
    slug: Slug,
    notionPageId: string
    title: string,
    imageUrl?: string,
    isPublished?: boolean
    courses?: Course[]
    difficulty?: Difficulty
    technologies?: Technology[]
}

export class Formation extends AggregateRoot<FormationProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get formationId(): FormationId {
        return FormationId.caller(this.id)
    }

    get notionPageId(): string {
        return this.props.notionPageId
    }

    get slug(): Slug {
        return this.props.slug
    }

    get title(): string {
        return this.props.title
    }

    get isPublished(): boolean {
        return this.props.isPublished
    }

    get imageUrl(): string {
        return this.props.imageUrl
    }

    get courses(): Course[] {
        return this.props.courses
    }

    get difficulty(): Difficulty {
        return this.props.difficulty
    }

    get difficultyId(): number {
        return this.props.difficulty.difficultyId
    }

    get technologies(): Technology[] {
        return this.props.technologies
    }

    private constructor(props: FormationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: FormationProps, id?: UniqueEntityID): Formation {

        const formation = new Formation({
            ...props,
        }, id);

        const idWasProvided = !!id;

        if (!idWasProvided) {
            formation.addDomainEvent(new FormationCreated(formation));
        }

        return formation;
    }
}