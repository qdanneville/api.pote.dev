import { IDomainEvent } from "../../../../core/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Course } from "../Course";

export class CourseCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public course: Course;

    constructor(course: Course) {
        this.dateTimeOccurred = new Date();
        this.course = course;
    }

    getAggregateId(): UniqueEntityID {
        return this.course.id;
    }
}