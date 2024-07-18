import { IpcAsyncListener, IpcListener } from "./types";

interface ListenerItem {
  name: string;
  callback: IpcListener | IpcAsyncListener;
  async: boolean;
}

const listenerDatabase: ListenerItem[] = [];
export default {
  on(name: string, listener: IpcListener) {
    listenerDatabase.push({
      name,
      callback: listener,
      async: false,
    });
  },
  handle(name: string, listener: IpcAsyncListener) {
    listenerDatabase.push({
      name,
      callback: listener,
      async: true
    });
  },
  send(name: string, data: any) {
    listenerDatabase.forEach(async (item) => {
      if (item.name === name && !item.async) {
        item.callback(null, data);
      }
    });
  },
  async invoke(name: string, data: any) {
    const match = listenerDatabase.find(item => item.async && item.name === name);
    if (match) {
      return await match.callback(null, data);
    }
  },
};