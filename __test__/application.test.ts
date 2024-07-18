import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import ipcRouter, { request, Application } from "../lib";
import { sleep } from '@linzb93/utils';

describe("ipc-router-application", () => {
  let app: Application;

  beforeAll(() => {
    app = ipcRouter.create();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('on与send，以发布/订阅方式通信', () => {
    const callback = vi.fn();
    callback.mockImplementationOnce((name: string) => `Hello ${name}`);
    app.on("syncMessage", callback);
    request.send("syncMessage", "Mike");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveReturnedWith("Hello Mike");
    app.removeAllListeners("syncMessage");
  });

  it("handle与invoke，以Promise方式通信", async () => {
    const callback = vi.fn();
    callback.mockImplementationOnce(async (message: string) => {
      await sleep(1000);
      return message;
    });
    app.handle("asyncMessage", callback);
    const response = await request("asyncMessage", "654321");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(response).toBe('654321');
    app.removeAllListeners("asyncMessage");
  });

  it("一个事件两次监听都能触发", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();
    app.on("twice-message", callback);
    app.on("twice-message", callback2);
    request.send("twice-message", "hello");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    app.removeAllListeners("twice-message");
  });

  it("没有监听的事件无法触发", () => {
    const callback = vi.fn();
    app.on("message", callback);
    request.send("send", "nothing");
    expect(callback).toHaveBeenCalledTimes(0);
    app.removeAllListeners("message");
  });

  it("错误处理", async () => {
    const errorHandler = vi.fn();
    errorHandler.mockImplementationOnce((err: Error, path: string) => {
      return {
        message: err.message,
        error:true,
        path
      }
    });
    app.catch(errorHandler);
    const eventFn = vi.fn();
    eventFn.mockImplementationOnce((data:any) => {
      const a = [];
      //@ts-ignore
      a.toFixed();
      return data;
    });
    app.handle("err-test-message", eventFn);
    const response = await request("err-test-message", 3);
    expect(response.error).toBeTruthy();
  })
});
