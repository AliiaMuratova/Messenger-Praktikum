import { expect } from 'chai';
import sinon from 'sinon';
import { HTTPTransport, METHOD } from './HttpTransport.js';

class FakeXHR {
  open = sinon.spy();
  send = sinon.spy();
  setRequestHeader = sinon.spy();
  getResponseHeader = sinon.stub();

  status = 200;
  response: string = '';

  timeout = 0;
  withCredentials = false;
  responseType: XMLHttpRequestResponseType = 'json';

  onload?: () => void;
  onerror?: () => void;
  ontimeout?: () => void;
  onabort?: () => void;

  triggerLoad() {
    this.onload?.();
  }

  triggerError() {
    this.onerror?.();
  }

  triggerTimeout() {
    this.ontimeout?.();
  }
}


describe('HTTPTransport', () => {
  let xhr: FakeXHR;
  let originalXHR: typeof XMLHttpRequest;

  beforeEach(() => {
    xhr = new FakeXHR();
    originalXHR = global.XMLHttpRequest;

    global.XMLHttpRequest = function() {
      return xhr;
    } as unknown as typeof XMLHttpRequest;
  });

  afterEach(() => {
    global.XMLHttpRequest = originalXHR;
    sinon.restore();
  });

  it('должен отправлять GET запрос', async () => {
    const api = new HTTPTransport('https://test.com');

    const promise = api.get('/users');

    xhr.getResponseHeader.withArgs('Content-Type').returns('application/json');
    xhr.response = JSON.stringify({ ok: true });

    xhr.triggerLoad();

    const result = await promise;

    expect(xhr.open.calledWith(METHOD.GET, 'https://test.com/users')).to.equal(true);
    expect(result).to.deep.equal({ ok: true });
  });

  it('должен отправлять POST с body', async () => {
    const api = new HTTPTransport('https://test.com');

    const promise = api.post('/login', {
      data: { login: 'test' }
    });

    xhr.getResponseHeader.returns('application/json');
    xhr.response = JSON.stringify({ success: true });

    xhr.triggerLoad();

    const result = await promise;

    expect(xhr.open.calledWith(METHOD.POST, 'https://test.com/login')).to.equal(true);
    expect(xhr.send.calledOnce).to.equal(true);
    expect(result).to.deep.equal({ success: true });
  });

  it('должен отклонять promise при ошибке API', async () => {
    const api = new HTTPTransport('https://test.com');

    const promise = api.get('/users');

    xhr.status = 404;
    xhr.response = JSON.stringify({ reason: 'Not found' });

    xhr.triggerLoad();

    try {
      await promise;
      expect.fail('Должен был выбросить ошибку');
    } catch (error) {
      expect((error as Error).message).to.equal('Not found');
    }
  });

  it('должен отклонять promise при network error', async () => {
    const api = new HTTPTransport('https://test.com');

    const promise = api.get('/users');

    xhr.triggerError();

    try {
      await promise;
      expect.fail('Должен был выбросить ошибку');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });

  it('должен отклонять promise при timeout', async () => {
    const api = new HTTPTransport('https://test.com');

    const promise = api.get('/users');

    xhr.triggerTimeout();

    try {
      await promise;
      expect.fail('Должен был выбросить ошибку');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});
