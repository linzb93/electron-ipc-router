import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { sleep } from "@linzb93/utils";
import { createServer, createClient, Application } from "../lib";
import { HTTP_CODE_MAP } from "../lib/constant";
import { client, server } from "../../demo/lib";

describe("event-router-basic", () => {
  let app: Application;
  let request: any;
  beforeAll(() => {
    app = createServer(server);
    request = createClient(client);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("基础功能", async () => {
    app.handle("message", async (data) => {
      await sleep(300);
      return data;
    });
    const response = await request("message", "hello");
    expect(response.result.params).toBe("hello");
    app.removeAllListeners("message");
  });
  it("接口找不到的", async () => {
    app.handle("message", async (data) => {
      await sleep(100);
      return data;
    });
    const response = await request("unknown-message", "hello");
    expect(response.code).toBe(HTTP_CODE_MAP.NOT_FOUND);
    app.removeAllListeners("message");
  });
  it("基础路由报错", async () => {
    app.handle("message", async (data) => {
      await sleep(100);
      //@ts-ignore
      const ret = [].slice1(1, 2);
      console.log(ret);
      return data;
    });
    const response = await request("message", "hello");
    expect(response.code).toBe(HTTP_CODE_MAP.SERVER_INTERNAL_ERROR);
    app.removeAllListeners("message");
  });
});
