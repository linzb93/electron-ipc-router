import { Listener, MiddlewareContext, IpcData } from "./types";
import { IPC_ROUTER_EVENT_KEY } from "./constant";
import ipcMain from "./ipcMain";

interface ListenerItem {
  path: string;
  callback: Listener;
  async: boolean;
}

interface MiddlewareItem {
  prefix: string;
  callback: (ctx: MiddlewareContext, next: Function) => void;
}

export default class Application {
  // 存放路由处理函数
  private listenerDatabase: ListenerItem[] = [];
  // 存放中间件
  private middlewareDatabase: MiddlewareItem[] = [];

  private errorHandler = (error: Error, path: string) => {
    console.log(error.message);
    console.log(path);
    return {
      code: 500,
      message: "server error",
    };
  };

  constructor() {
    ipcMain.handle(
      IPC_ROUTER_EVENT_KEY,
      async (_event: any, sourceStr: string) => {
        const source = JSON.parse(sourceStr) as IpcData;
        const { path, data } = source;
        const matchRouter = async () => {
          const match = this.listenerDatabase.find(
            (item) => item.path === path && item.async
          );
          if (match) {
            return await match.callback(data);
          }
          return null;
        };
        const next = this.routerNextHandler(path, matchRouter);
        try {
          return await next();
        } catch (e) {
          return this.errorHandler(e as Error, path);
        }
      }
    );
  }

  /**
   * 以Promise模式监听
   * @param {string} path - 路径，以`-`符号间隔
   * @param {Function} callback - (data: any) => void 回调函数
   */
  handle(path: string, callback: Listener) {
    this.listenerDatabase.push({
      path,
      callback,
      async: true,
    });
  }
  /**
   * 移除所有监听事件。每个单元测试结束后一定要调用，否则下一个同名的监听事件不会触发。
   * @param {string} path - 事件名称
   */
  removeAllListeners(path: string) {
    this.listenerDatabase = this.listenerDatabase.filter(
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
  /** */
  catch(errorHandler: (error: Error, path: string) => any) {
    this.errorHandler = errorHandler;
  }

  private routerNextHandler(path: string, matchRouter: Function) {
    let index = -1;
    /**
     * 匹配条件：
     * 1. mw.prefix为空
     * 2. mw.prefix不为空时，能够匹配前缀
     * 3. 同步或异步类型
     */
    const isMiddlewareMatch = (middleware: MiddlewareItem) =>
      middleware &&
      (middleware.prefix === "" || path.startsWith(`${middleware.prefix}-`));
    const next = () => {
      if (!this.middlewareDatabase.length) {
        return matchRouter();
      }
      index += 1;
      let middleware = this.middlewareDatabase[index];
      if (!middleware) {
        return matchRouter();
      }
      while (!isMiddlewareMatch(middleware)) {
        index += 1;
        middleware = this.middlewareDatabase[index];
      }
      return middleware.callback(
        {
          path: path.slice(middleware.prefix.length + 1),
        },
        next
      );
    };
    return next;
  }
}
