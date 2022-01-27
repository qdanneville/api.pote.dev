import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { CourseCreated } from "./events/CourseCreated";
import { CourseId } from "./CourseId";
import { Slug } from "./slug";
import { Prerequisite } from "./prerequisite";
import { Difficulty } from "./difficulty";
import { Tag } from "./tag";
import { Technology } from "./technology";

export interface CourseProps {
    title: string
    slug: Slug
    notionPageId: string
    imageUrl?: string
    tags?: Tag[]
    technologies?: Technology[]
    prerequisites?: Prerequisite[]
    difficulty: Difficulty
    isPublished: boolean
    duration?: number
    order?: number
}

export class Course extends AggregateRoot<CourseProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get courseId(): CourseId {
        return CourseId.caller(this.id)
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

    get duration(): number {
        return this.props.duration
    }

    get order(): number {
        return this.props.order
    }

    get tags(): Tag[] {
        return this.props.tags
    }

    get technologies(): Technology[] {
        return this.props.technologies
    }

    get difficulty(): Difficulty {
        return this.props.difficulty
    }

    get difficultyId(): number {
        return this.props.difficulty.difficultyId
    }

    get prerequisites(): Prerequisite[] {
        return this.props.prerequisites
    }

    private constructor(props: CourseProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: CourseProps, id?: UniqueEntityID): Course {

        const course = new Course({
            ...props,
        }, id);

        const idWasProvided = !!id;

        if (!idWasProvided) {
            course.addDomainEvent(new CourseCreated(course));
        }

        return course;
    }
}