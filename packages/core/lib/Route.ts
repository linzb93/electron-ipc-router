import { HTTP_CODE_MAP } from "./constant";
import { MiddlewareContext, Listener } from "./types";
import { getErrorHandler, ErrorHandlerFn } from "./error";
interface ListenerItem {
  path: string;
  callback: Listener;
}

const Route = () => {
  const database: ListenerItem[] = [];
  const returnCallback = async (ctx: MiddlewareContext, next: Function) => {
    const match = database.find((item) => ctx.path === item.path);
    if (!match) {
      return await next();
    }
    let result: any;
    try {
      result = await match.callback(ctx);
    } catch (error: any) {
      const path = `${ctx.prefix}-${ctx.path}`;
      const errorHandler = getErrorHandler();
      errorHandler(path, error);
      return {
        code: HTTP_CODE_MAP.SERVER_INTERNAL_ERROR,
        path,
        message: error.message,
      };
    }
    return result;
  };
  returnCallback.handle = (path: string, callback: Listener) => {
    database.push({
      path,
      callback,
    });
  };
  return returnCallback;
};

export default Route;
