import { IpcListener } from "./types";

interface ListenerItem {
  name: string;
  callback: IpcListener;
}

const listenerDatabase: ListenerItem[] = [];
export default {
  handle(name: string, listener: IpcListener) {
    listenerDatabase.push({
      name,
      callback: listener,
    });
  },
  async invoke(name: string, data: string) {
    const match = listenerDatabase.find((item) => item.name === name);
    if (match) {
      return await match.callback(null, data);
    }
  },
};
