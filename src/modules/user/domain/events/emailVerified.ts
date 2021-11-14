import { User } from "../user";
import { IDomainEvent } from "../../../../core/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class EmailVerified implements IDomainEvent {
    public dateTimeOccurred: Date;
    public user: User;

    constructor(user: User) {
        this.dateTimeOccurred = new Date();
        this.user = user;
    }

    public getAggregateId(): UniqueEntityID {
        return this.user.id;
    }
}