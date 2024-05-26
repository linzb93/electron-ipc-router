import { Listener } from "./types";
import ipcMain from "./ipcMain";

interface ListenerItem {
  name: string;
  callback: Listener;
}
interface Context {
  path: string;
}
interface MiddlewareItem {
  path: string;
  middleware: (ctx: Context, next: Function) => void;
}

export default class {
  private listenerDatabase: ListenerItem[] = [];
  private middlewareDatabase: MiddlewareItem[] = [];
  constructor() {
    ipcMain.on("api", (uselessEvent: any, data: any) => {
      const { name } = data;
      this.listenerDatabase.forEach((item) => {
        if (item.name === name) {
          item.callback(data.data);
        }
      });
    });
  }
  on(name: string, callback: Listener) {
    this.listenerDatabase.push({
      name,
      callback,
    });
  }
  use(path: string, middleware: (ctx: Context, next: Function) => void) {
    this.middlewareDatabase.push({
      path,
      middleware,
    });
  }
}
