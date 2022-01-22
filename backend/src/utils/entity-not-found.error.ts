export class EntityNotFoundError extends Error {
  constructor(entityName: string, public readonly predicate?: unknown) {
    super(`"${entityName}" not found` + (predicate ? ', ' + JSON.stringify(predicate) : ''));
  }
}
