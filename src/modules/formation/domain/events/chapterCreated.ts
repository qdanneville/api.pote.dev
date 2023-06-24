import { IDomainEvent } from "../../../../core/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Chapter } from "../chapter";

export class ChapterCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public chapter: Chapter;

    constructor(chapter: Chapter) {
        this.dateTimeOccurred = new Date();
        this.chapter = chapter;
    }

    getAggregateId(): UniqueEntityID {
        return this.chapter.id;
    }
}