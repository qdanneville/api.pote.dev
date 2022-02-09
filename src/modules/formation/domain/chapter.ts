import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { ChapterCreated } from "./events/chapterCreated";
import { ChapterId } from "./chapterId";
import { Slug } from "./slug";
import { Course } from "./course";

export interface ChapterProps {
    slug: Slug,
    notionPageId: string
    title: string,
    imageUrl?: string,
    duration?: number,
    course?: Course,
    order?: number
}

export class Chapter extends AggregateRoot<ChapterProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get chapterId(): ChapterId {
        return ChapterId.caller(this.id)
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

    get order(): number {
        return this.props.order
    }

    get imageUrl(): string {
        return this.props.imageUrl
    }

    get course(): Course {
        return this.props.course
    }

    get courseId(): string {
        return this.props.course.id.toString()
    }

    private constructor(props: ChapterProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ChapterProps, id?: UniqueEntityID): Chapter {

        const chapter = new Chapter({
            ...props,
        }, id);

        const idWasProvided = !!id;

        if (!idWasProvided) {
            chapter.addDomainEvent(new ChapterCreated(chapter));
        }

        return chapter;
    }
}