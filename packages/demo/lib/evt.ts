

interface ListenerItem {
  name: string;
  callback: ListenerCallback;
}

type ListenerCallback = (data:any) => Promise<any>;

const listenerDatabase: ListenerItem[] = [];
export default {
  handle(name: string, listener: ListenerCallback) {
    listenerDatabase.push({
      name,
      callback: listener,
    });
  },
  async invoke(name: string, data: any):Promise<any> {
    const match = listenerDatabase.find((item) => item.name === name);
    if (match) {
      return await match.callback(data);
    }
  },
};
