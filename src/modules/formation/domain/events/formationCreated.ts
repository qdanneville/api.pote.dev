import { IDomainEvent } from "../../../../core/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Formation } from "../formation";

export class FormationCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public formation: Formation;

    constructor(Formation: Formation) {
        this.dateTimeOccurred = new Date();
        this.formation = Formation;
    }

    getAggregateId(): UniqueEntityID {
        return this.formation.id;
    }
}