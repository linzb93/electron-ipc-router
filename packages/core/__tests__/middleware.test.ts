import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { createServer, createClient, Application, Route } from "../lib";
import { HTTP_CODE_MAP } from "../lib/constant";
import { client, server } from "../../demo/lib";
import { sleep } from "@linzb93/utils";

describe("ipc-router-middleware", () => {
  let app: Application;
  let request: any;
  beforeAll(() => {
    app = createServer(server);
    request = createClient(client);
  });

  afterEach(() => {
    app.removeAllMiddlewares();
    vi.restoreAllMocks();
  });

  it("中间件", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      await sleep(200);
      return await next();
    });
    eventFn.mockImplementationOnce(async (message: string) => {
      await sleep(200);
      return message;
    });
    app.use(middlewareFn);
    app.handle("mw-handle-message", eventFn);
    const response = await request("mw-handle-message", "hello2");
    expect(middlewareFn).toHaveBeenCalledTimes(1);
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response).toBe("hello2");
    app.removeAllListeners("mw-handle-message");
  });

  it("中间件-含路径", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      await sleep(200);
      return await next();
    });
    eventFn.mockImplementationOnce(async (message: string) => {
      await sleep(200);
      return message;
    });
    app.use("mw", middlewareFn);
    app.handle("mw-handle-message", eventFn);
    const response = await request("mw-handle-message", "hello2");
    expect(middlewareFn).toHaveBeenCalledTimes(1);
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response).toBe("hello2");
    app.removeAllListeners("mw-handle-message");
  });
  it("中间件代码在next后面的", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      const result = await next();
      return {
        result,
        success: true,
      };
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
    expect(response.success).toBe(true);
    app.removeAllListeners("mw-handle-message");
  });
  it("中间件报错", async () => {
    const eventFn = vi.fn();
    const middlewareFn = vi.fn();
    middlewareFn.mockImplementation(async (_, next) => {
      await sleep(200);
      //@ts-ignore
      const ret = [].slice1(1, 2);
      console.log(ret);
      return await next();
    });
    eventFn.mockImplementationOnce(async (message: string) => {
      await sleep(200);
      return message;
    });
    app.use(middlewareFn);
    app.handle("message", eventFn);
    const response = await request("message", "hello2");
    expect(middlewareFn).toHaveBeenCalledTimes(1);
    expect(response.code).toBe(HTTP_CODE_MAP.SERVER_INTERNAL_ERROR);
    app.removeAllListeners("message");
  });

  it("子路由", async () => {
    const eventFn = vi.fn();
    eventFn.mockImplementationOnce(async (ctx) => {
      await sleep(300);
      return ctx.params;
    });
    const router = Route();
    router.handle("message", eventFn);
    app.use("user", router);
    const response = await request("user-message", "nothing");
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response).toBe("nothing");
    app.removeAllListeners("user-message");
  });

  it("子路由报错", async () => {
    const eventFn = vi.fn();
    eventFn.mockImplementationOnce(async (ctx) => {
      await sleep(300);
      //@ts-ignore
      const ret = [].slice1(1, 2);
      console.log(ret);
      return ctx.params;
    });
    const router = Route();
    router.handle("message", eventFn);
    app.use("user", router);
    const response = await request("user-message", "nothing");
    expect(eventFn).toHaveBeenCalledTimes(1);
    expect(response.code).toBe(HTTP_CODE_MAP.SERVER_INTERNAL_ERROR);
    app.removeAllListeners("user-message");
  });
});
