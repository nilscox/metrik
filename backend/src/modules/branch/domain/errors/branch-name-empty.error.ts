export class BranchNameEmptyError extends Error {
  constructor() {
    super("a branch's name cannot be empty");
  }
}
