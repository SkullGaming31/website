import '@testing-library/jest-dom';
// optional: polyfill fetch for tests that need it
import 'whatwg-fetch';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './fetchMock';

// Start our lightweight fetch mock before tests, reset between tests and close afterwards
beforeAll(() => server.start());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// You can add global mocks or utilities here
export {};
