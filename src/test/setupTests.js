import '@testing-library/jest-dom';

class MockIntersectionObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
    MockIntersectionObserver.instances.push(this);
  }

  trigger(entries) {
    this.callback(entries, this);
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

globalThis.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  localStorage.clear();
  globalThis.fetch = jest.fn();
  MockIntersectionObserver.instances = [];
});
