import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { AggregateRoot } from 'src/core/domain/AggregateRoot';
import { Slug } from './slug';
import { LessonId } from './lessonId';
import { Chapter } from './chapter';
import { LessonCreated } from './events/lessonCreated';

export interface LessonProps {
    title: string;
    slug: Slug;
    notionPageId: string
    notionContent?: object
    imageUrl?: string
    duration?: number
    order?: number
    chapter?: Chapter
}

export class Lesson extends AggregateRoot<LessonProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get lessonId(): LessonId {
        return LessonId.caller(this.id)
    }

    get title(): string {
        return this.props.title;
    }

    get notionPageId(): string {
        return this.props.notionPageId
    }

    get notionContent(): object {
        return this.props.notionContent
    }

    get slug(): Slug {
        return this.props.slug;
    }

    get imageUrl(): string {
        return this.props.imageUrl;
    }

    get duration(): number {
        return this.props.duration;
    }

    get order(): number {
        return this.props.order;
    }

    get chapter(): Chapter {
        return this.props.chapter
    }

    get chapterId(): string {
        return this.props.chapter.chapterId.id.toString()
    }

    set notionContent(content:object) {
        this.props.notionContent = content
    }

    private constructor(props: LessonProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: LessonProps, id?: UniqueEntityID): Lesson {

        const lesson = new Lesson({
            ...props,
        }, id);

        const idWasProvided = !!id;

        if (!idWasProvided) {
            lesson.addDomainEvent(new LessonCreated(lesson));
        }

        return lesson;
    }
}