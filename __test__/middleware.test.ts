import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";

import ipcRouter, { request, Application, Route } from "../lib";
import { sleep } from "@linzb93/utils";
describe("ipc-router-middleware", () => {
  let app: Application;

  beforeAll(() => {
    app = ipcRouter.create();
  });

  afterEach(() => {
    app.removeAllMiddlewares();
    vi.restoreAllMocks();
  });

  it("中间件-handle", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      await sleep(500);
      return await next();
    });
    eventFn.mockImplementationOnce(async (message: string) => {
      await sleep(300);
      return message;
    });
    app.use(middlewareFn);
    app.handle("mw-handle-message", eventFn);
    const response = await request("mw-handle-message", "hello2");
    expect(middlewareFn).toHaveBeenCalledTimes(1);
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response.result.params).toBe("hello2");
    app.removeAllListeners("mw-handle-message");
  });

  it("中间件-handle-含路径", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      await sleep(500);
      return await next();
    });
    eventFn.mockImplementationOnce(async (message: string) => {
      await sleep(300);
      return message;
    });
    app.use("mw", middlewareFn);
    app.handle("mw-handle-message", eventFn);
    const response = await request("mw-handle-message", "hello2");
    expect(middlewareFn).toHaveBeenCalledTimes(1);
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response.result.params).toBe("hello2");
    app.removeAllListeners("mw-handle-message");
  });

  it("子路由-on", () => {
    // const eventFn = vi.fn();
    // const router = Route();
    // router.on("message", eventFn);
    // app.use("user", router);
    // request.send("user-message", "nothing");
    // expect(eventFn).toHaveBeenCalledTimes(1);
  });
});
