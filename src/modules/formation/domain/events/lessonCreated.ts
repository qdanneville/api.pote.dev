import { IDomainEvent } from "../../../../core/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Lesson } from "../lesson";

export class LessonCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public lesson: Lesson;

    constructor(lesson: Lesson) {
        this.dateTimeOccurred = new Date();
        this.lesson = lesson;
    }

    getAggregateId(): UniqueEntityID {
        return this.lesson.id;
    }
}