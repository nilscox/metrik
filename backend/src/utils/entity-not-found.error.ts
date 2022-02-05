export class EntityNotFoundError extends Error {
  constructor(entityName: string, public readonly predicate?: Record<string, unknown>) {
    super(`${entityName} not found`);
  }
}
