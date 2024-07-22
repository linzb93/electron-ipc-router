import Application from "./application";
export { default as Route } from "./Route";
export { default as request } from "./request";
export type { MiddlewareContext } from "./types";

export default {
  create() {
    return new Application();
  },
};

// 单元测试用
export type { Application };
