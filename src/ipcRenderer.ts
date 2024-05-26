import ipc from "./electronIpc";

const ipcRenderer = {
  send(event: string, data: any) {
    ipc.send(event, data);
  },
};

export default ipcRenderer;
