const { create } = require('../FakeNetwork');

const googleUrl = 'http://www.google.com';
const anyGoogleUrl = 'http://*.google.com';
const gmailUrl = 'http://mail.google.com';
const driveUrl = 'http://drive.google.com';
let fakeNetwork;
const setRequestInterception = jest.fn(async () => {});
const on = jest.fn(() => {});
const fakePage = {
  setRequestInterception,
  on,
};

function simulateRequest(fakeNetworkInstance, url, method = 'GET') {
  const continueMock = jest.fn();
  const respondMock = jest.fn();
  const fakeRequest = {
    url: () => url,
    method: () => method,
    continue: continueMock,
    respond: respondMock,
  };
  const response = fakeNetworkInstance.requestHandler(fakeRequest);
  return {
    fakeRequest,
    continueMock,
    respondMock,
    response,
  };
}

beforeEach(async () => {
  fakeNetwork = await create(fakePage);
});

afterEach(() => {
  on.mockReset();
  setRequestInterception.mockReset();
});

test('should throw when created without page', async () => {
  await expect(create()).rejects.toEqual(new Error('No puppeteer to intercept'));
});

test('should activate request interception in page on creation', async () => {
  setRequestInterception.mockReset();
  await create(fakePage);

  expect(setRequestInterception).toBeCalledWith(true);
});

test('should register a request handler in page on creation', async () => {
  on.mockReset();
  await create(fakePage);

  expect(on).toBeCalledWith('request', expect.any(Function));
});

test('should continue request if no handler available', () => {
  const { continueMock } = simulateRequest(fakeNetwork, googleUrl);

  expect(continueMock).toBeCalled();
});

test('should register a handler', () => {
  const response = 'Hello World';

  fakeNetwork.respondWith({
    url: googleUrl,
    response,
  });

  const { respondMock } = simulateRequest(fakeNetwork, googleUrl);

  expect(respondMock).toBeCalledWith(expect.objectContaining({ body: response }));
});

test('should invoke response callback given at register', () => {
  const response = jest.fn();

  fakeNetwork.respondWith({
    url: googleUrl,
    response,
  });

  const { fakeRequest } = simulateRequest(fakeNetwork, googleUrl);

  expect(response).toBeCalledWith(fakeRequest);
});

test('should respond with string response \'Hello World\'', () => {
  const response = 'Hello World';

  fakeNetwork.respondWith({
    url: googleUrl,
    response,
  });

  const { respondMock } = simulateRequest(fakeNetwork, googleUrl);

  expect(respondMock).toBeCalledWith(expect.objectContaining({ body: response }));
});

test('should respond with the response body \'Hello World\'', () => {
  const body = 'Hello World';

  fakeNetwork.respondWith({
    url: googleUrl,
    response: {
      body
    },
  });

  const { respondMock } = simulateRequest(fakeNetwork, googleUrl);

  expect(respondMock).toBeCalledWith(expect.objectContaining({ body }));
});

test('should respond with response status 404', () => {
  const status = 404;

  fakeNetwork.respondWith({
    url: googleUrl,
    response: {
      status,
    },
  });

  const { respondMock } = simulateRequest(fakeNetwork, googleUrl);

  expect(respondMock).toBeCalledWith(expect.objectContaining({ status }));
});

test('should handle globs urls', () => {
  const response = 'response from google';
  fakeNetwork.respondWith({
    url: anyGoogleUrl,
    response,
  });

  const { respondMock: gmailRespondMock } = simulateRequest(fakeNetwork, gmailUrl);
  expect(gmailRespondMock).toBeCalledWith(expect.objectContaining({ body: response }));


  const { respondMock: driveRespondMock } = simulateRequest(fakeNetwork, driveUrl);
  expect(driveRespondMock).toBeCalledWith(expect.objectContaining({ body: response }));

});

test('should throw an error if register a handler without url', () => {
  const urlMissingError = new Error('The url is a mandatory argument');
  expect(() => fakeNetwork.respondWith()).toThrow(urlMissingError);
});

test('should throw an error if register a handler response', () => {
  const responseMissingError = new Error('The response is a mandatory argument');
  expect(() => fakeNetwork.respondWith({
    url: googleUrl,
  })).toThrow(responseMissingError);
});
