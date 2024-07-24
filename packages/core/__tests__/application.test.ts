import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { sleep } from "@linzb93/utils";
import { createServer, createClient, Application } from '../lib';
import { client, server } from '../../demo/lib';

describe('event-router-basic', () => {
  let app: Application;
  let request: any;
  beforeAll(() => {
    app = createServer(server);
    request = createClient(client);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('基础功能', async () => {
    app.handle('message', async data => {
      await sleep(300);
      return data;
    });
    const response = await request('message', 'hello');
    expect(response.result).toBe('hello');
    app.removeAllListeners("message");
  });
  it('找不到的', async () => {
    app.handle('message', async data => {
      await sleep(100);
      return data;
    });
    const response = await request('unknown-message', 'hello');
    expect(response.code).toBe(404);
    app.removeAllListeners("message");
  });
})