import { EVENT_ROUTER_KEY, HTTP_CODE_MAP } from "./constant";
import {
  Listener,
  IServer,
  MiddlewareItem,
  MiddlewareContext,
  PostData,
} from "./types";
import { setErrorHandler, getErrorHandler, ErrorHandlerFn } from "./error";

interface ListenerItem {
  path: string;
  callback: Listener;
}
export default class {
  // 存放路由处理函数
  private routerDatabase: ListenerItem[] = [];
  // 存放中间件
  private middlewareDatabase: MiddlewareItem[] = [];

  constructor(private server: IServer) {
    this.init();
  }

  init() {
    this.server.handle(EVENT_ROUTER_KEY, async (data) => {
      return await this.main(data);
    });
  }
  private async main(data: PostData): Promise<any> {
    const { path, params } = data;
    const matchRouter = async (middlewareRet: any) => {
      const route = this.routerDatabase.find((item) => item.path === path);
      if (route) {
        try {
          return await route.callback(params);
        } catch (error: any) {
          const errorHandler = getErrorHandler();
          errorHandler(path, error);
          return {
            code: HTTP_CODE_MAP.SERVER_INTERNAL_ERROR,
            path,
            message: error.message,
          };
        }
      }
      if (!this.middlewareDatabase.length && middlewareRet === null) {
        return {
          code: HTTP_CODE_MAP.NOT_FOUND,
          path,
          message: "NOT_FOUND",
        };
      }
      return middlewareRet;
    };
    try {
      const next = this.routerNextHandler(path, params, matchRouter);
      return await next();
    } catch (error: any) {
      return {
        code: HTTP_CODE_MAP.SERVER_INTERNAL_ERROR,
        path,
        message: error.message,
      };
    }
  }
  private routerNextHandler(path: string, data: any, matchRouter: Function) {
    let index = -1;
    /**
     * 匹配条件：
     * 1. mw.prefix为空
     * 2. mw.prefix不为空时，能够匹配前缀
     * 3. 同步或异步类型
     */
    const isMiddlewareMatch = (middleware: MiddlewareItem) =>
      middleware.prefix === "" || path.startsWith(`${middleware.prefix}-`);
    let result: any = null;
    const next = async () => {
      if (!this.middlewareDatabase.length) {
        return matchRouter(result);
      }
      index += 1;
      let middleware = this.middlewareDatabase[index];
      if (!middleware) {
        return matchRouter(result);
      }
      while (middleware && !isMiddlewareMatch(middleware)) {
        index += 1;
        middleware = this.middlewareDatabase[index];
      }
      if (!middleware) {
        return matchRouter(result);
      }
      result = await middleware.callback(
        {
          path: path.slice(middleware.prefix.length + 1),
          prefix: middleware.prefix,
          params: data,
        },
        next
      );
      return result;
    };
    return next;
  }
  /**
   * 以Promise模式监听
   * @param {string} path - 路径，以`-`符号间隔
   * @param {Function} callback - (data: any) => void 回调函数
   */
  handle(path: string, callback: Listener) {
    this.routerDatabase.push({
      path,
      callback,
    });
  }
  /**
   * 移除所有监听事件。每个单元测试结束后一定要调用，否则下一个同名的监听事件不会触发。
   * @param {string} path - 事件名称
   */
  removeAllListeners(path: string) {
    this.routerDatabase = this.routerDatabase.filter(
      (item) => item.path !== path
    );
  }
  /**
   * 移除所有中间件，每个单元测试结束后一定要调用。
   */
  removeAllMiddlewares() {
    this.middlewareDatabase = [];
  }
  /**
   * 注册中间件。
   * @param middleware - 中间件处理函数
   */
  use(middleware: (ctx: MiddlewareContext, next: Function) => any): void;
  /**
   * 注册中间件。
   * @param path - 中间件对应的路径前缀
   * @param middleware - 中间件处理函数
   */
  use(
    path: string,
    middleware: (ctx: MiddlewareContext, next: Function) => any
  ): void;
  use(...params: any[]) {
    let path = "";
    let callback = null;
    if (params.length === 1) {
      callback = params[0];
    } else if (params.length === 2) {
      path = params[0];
      callback = params[1];
    }
    this.middlewareDatabase.push({
      prefix: path,
      callback,
    });
  }

  // 错误处理
  catch(fn: ErrorHandlerFn) {
    setErrorHandler(fn);
  }
}
