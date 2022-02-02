export class DomainEvent<Payload> {
  constructor(public readonly aggregateId: string, public readonly payload: Payload) {}
}
