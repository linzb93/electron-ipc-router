import { MiddlewareContext, Listener } from "./types";

interface ListenerItem {
  path: string;
  callback: Listener;
  async: boolean;
}

const Route = () => {
  const database: ListenerItem[] = [];
  const returnCallback = (ctx: MiddlewareContext, next: Function) => {
    database.forEach((item) => {
      if (ctx.path === item.path) {
        item.callback(ctx);
      }
    });
    next();
  };
  returnCallback.handle = (path: string, callback: Listener) => {
    database.push({
      path,
      callback,
      async: true,
    });
  };
  return returnCallback;
};

export default Route;
