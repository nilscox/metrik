import expect from 'expect';

import { partition } from './partition';

describe('partition', () => {
  it('partition', () => {
    expect(
      partition('label', [
        { label: 'a', value: 1 },
        { label: 'a', value: 2 },
        { label: 'b', value: 3 },
      ]),
    ).toEqual({
      a: [
        { label: 'a', value: 1 },
        { label: 'a', value: 2 },
      ],
      b: [{ label: 'b', value: 3 }],
    });
  });
});
