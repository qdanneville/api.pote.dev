import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { FormationCreated } from "./events/formationCreated";
import { FormationId } from "./FormationId";

interface FormationProps {
    slug: string,
    notionPageId: string
    title: string,
    imageUrl?: string,
    isPublished?: boolean
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

    get slug(): string {
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