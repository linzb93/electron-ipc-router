import { describe, it, expect, vi, beforeAll } from "vitest";
import ipcRouter, { request, Application } from "../src";
import { sleep } from '@linzb93/utils';

describe("ipc-router", () => {
  let app: Application;
  beforeAll(() => {
    app = ipcRouter.create();
  });
  it("基本用法", async () => {
    const callback = vi.fn();
    callback.mockImplementationOnce(async (message: any) => {
      await sleep(1000);
      return message;
    })
    app.handle("message", callback);
    const response = await request("message", "hello");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(response).toBe('hello');
  });
  it.skip("一个事件两次监听都能触发", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();
    app.handle("message", callback);
    app.handle("message", callback2);
    request("message", "hello");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
  it("没有监听的事件无法触发", () => {
    const callback = vi.fn();
    app.handle("message", callback);
    request("send", "nothing");
    expect(callback).toHaveBeenCalledTimes(0);
  });
  // it.todo('Promise', () => {
  //   const callback = vi.fn();
  //   app
  // });
});
