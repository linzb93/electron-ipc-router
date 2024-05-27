import { Listener } from "./types";
import ipcMain from "./ipcMain";

interface ListenerItem {
  name: string;
  callback: Listener;
  async: boolean;
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
    ipcMain.on("api", (_event: any, data: any) => {
      const { name } = data;
      this.listenerDatabase.forEach((item) => {
        if (item.name === name && !item.async) {
          item.callback(data.data);
        }
      });
    });
    ipcMain.handle("api", async (_event: any, data: any) => {
      const { name } = data;
      const match = this.listenerDatabase.find(item => item.name === name && item.async);
      if (match) {
        return match.callback(data.data);
      }
    });
  }
  on(name: string, callback: Listener) {
    this.listenerDatabase.push({
      name,
      callback,
      async:false,
    });
  }
  handle(name: string, callback: Listener) {
    this.listenerDatabase.push({
      name,
      callback,
      async:true,
    });
  }
  use(path: string, middleware: (ctx: Context, next: Function) => void) {
    this.middlewareDatabase.push({
      path,
      middleware,
    });
  }
}
