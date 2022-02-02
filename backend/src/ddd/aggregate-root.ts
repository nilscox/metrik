import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<Props extends { id: string }> extends Entity<Props> {
  private _events: Array<DomainEvent<unknown>> = [];

  addEvent(event: DomainEvent<unknown>) {
    this._events.push(event);
  }
}
