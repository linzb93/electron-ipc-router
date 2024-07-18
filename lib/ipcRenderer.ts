import ipc from "./electronIpc";

const ipcRenderer = {
  send(event: string, data: any) {
    ipc.send(event, data);
  },
  async invoke(event: string, data: any) {
    return await ipc.invoke(event, data);
  },
};

export default ipcRenderer;