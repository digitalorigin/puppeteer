const minimatch = require("minimatch");

class FakeNetwork {
  static async build(puppeteerPage) {
    const instance = new FakeNetwork(puppeteerPage);
    await instance.initialize();
    return instance;
  }

  constructor(puppeteerPage) {
    if (!puppeteerPage) {
      throw new Error('No puppeteer to intercept');
    }
    this.page = puppeteerPage;
    this.handlers = [];
  }

  async initialize() {
    await this.page.setRequestInterception(true);
    this.page.on('request', this.requestHandler.bind(this));
  }

  getHandler(url, method) {
    return this.handlers
      .filter(handler => handler.url === url || minimatch(url, handler.url))
      .find(handler => handler.method === method);
  }


  requestHandler(request) {
    const handler = this.getHandler(request.url(), request.method());
    if (!handler) {
      return request.continue();
    }

    const { response } = handler;
    if (typeof response === 'function') {
      return response(request);
    }


    if (typeof response === 'string') {
      return request.respond({
        status: 200,
        contentType: 'application/json',
        body: response,
      })
    }

    const { status = 200, headers = {}, contentType = 'application/json', body } = response;
    return request.respond({
      headers,
      body,
      contentType,
      status,
    });

  }

  respondWith({
                method = 'GET',
                url,
                response,
              } = {}) {
    if (!url) {
      throw new Error('The url is a mandatory argument');
    }

    if (!response) {
      throw new Error('The response is a mandatory argument');
    }
    this.handlers.push({
      url,
      method,
      response,
    });
  }

  restore() {
    this.handlers = [];
  }

}

async function create(puppeteerPage) {
  return await FakeNetwork.build(puppeteerPage);
}

module.exports = {
  create,
};
