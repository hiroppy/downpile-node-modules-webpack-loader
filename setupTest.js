process.env.NODE_ENV = 'test';

jest.setTimeout(60000);

afterAll(() => {
  jest.resetAllMocks();
});

afterEach(() => {});
