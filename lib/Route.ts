import { MiddlewareContext, Listener } from "./types";

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
    return await match.callback(ctx);
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
