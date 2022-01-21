import { Mock } from 'jest-mock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockFn<T extends (...args: any[]) => any> = Mock<ReturnType<T>, Parameters<T>>;
