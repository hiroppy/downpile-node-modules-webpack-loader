import { downpileCode } from '../src/downpileCode';

describe('downpileCode', () => {
  it("shouldn't downpile", async () => {
    expect(await downpileCode('var test = 1', 5)).toMatchSnapshot();
  });
  it('should downpile to es5', async () => {
    expect(await downpileCode('const test = 1', 5)).toMatchSnapshot();
  });
  it('should apply polyfill', async () => {
    expect(
      await downpileCode('new Promise(() => {})', 5, {
        polyfill: true,
      })
    ).toMatchSnapshot();
  });
});
