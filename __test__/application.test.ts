import { describe, it, expect, vi, beforeAll } from "vitest";
import ipcRouter, { request, Application } from "../src";

describe("ipc-router", () => {
  let app: Application;
  beforeAll(() => {
    app = ipcRouter.create();
  });
  it("基本用法", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    app.on("message", callback);
    app.on("message", callback2);
    app.on("send", callback2);
    request("message", "hello");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(0);
  });
  it("一个事件两次监听都能触发", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();
    app.on("message", callback);
    app.on("message", callback2);
    request("message", "hello");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
  it("没有监听的事件无法触发", () => {
    const callback = vi.fn();
    app.on("message", callback);
    request("send", "nothing");
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
