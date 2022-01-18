export class FixtureStore<T extends { id: string }> {
  constructor(protected items: T[]) {}
}
