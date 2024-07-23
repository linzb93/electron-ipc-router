import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import ipcRouter, { request, Application } from "../lib";
import { sleep } from "@linzb93/utils";

describe("ipc-router-application", () => {
  let app: Application;

  beforeAll(() => {
    app = ipcRouter.create();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("基础通信", async () => {
    const callback = vi.fn();
    callback.mockImplementationOnce(async (message: string) => {
      await sleep(1000);
      return message;
    });
    app.handle("basicMessage", callback);
    const response = await request("basicMessage", "message from event basicMessage");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(response).toBe("message from event basicMessage");
    app.removeAllListeners("basicMessage");
  });

  it("没有监听的事件无法触发", async () => {
    const callback = vi.fn();
    app.handle("unTriggerMessage", callback);
    const response = await request("basicMessage", "hello");
    expect(response.code).toBe(404);
  });

  it.skip("错误处理", async () => {
    const errorHandler = vi.fn();
    errorHandler.mockImplementationOnce((err: Error, path: string) => {
      return {
        message: err.message,
        error: true,
        path,
      };
    });
    app.catch(errorHandler);
    const eventFn = vi.fn();
    eventFn.mockImplementationOnce((data: any) => {
      const a = [];
      //@ts-ignore
      a.toFixed();
      return data;
    });
    app.handle("err-test-message", eventFn);
    const response = await request("err-test-message", 3);
    expect(response.error).toBeTruthy();
  });
});
