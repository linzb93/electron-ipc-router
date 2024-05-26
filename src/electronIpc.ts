import { Listener, IpcListener } from "./types";

interface ListenerItem {
  name: string;
  callback: IpcListener;
}

const listenerDatabase: ListenerItem[] = [];
export default {
  on(name: string, listener: IpcListener) {
    listenerDatabase.push({
      name,
      callback: listener,
    });
  },
  send(name: string, data: any) {
    listenerDatabase.forEach((item) => {
      if (item.name === name) {
        item.callback(null, data);
      }
    });
  },
};
