export class ProjectNameEmptyError extends Error {
  constructor() {
    super("a project's name cannot be empty");
  }
}
