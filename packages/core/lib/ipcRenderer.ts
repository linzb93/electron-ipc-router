import ipc from "./electronIpc";

const ipcRenderer = {
  async invoke(event: string, data: string) {
    return await ipc.invoke(event, data);
  },
};

export default ipcRenderer;
