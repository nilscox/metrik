import { Mock } from 'jest-mock';

export type MockFn<T extends (...args: unknown[]) => unknown> = Mock<
  ReturnType<T>,
  Parameters<T>
>;
