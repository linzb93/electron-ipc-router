import { IpcListener } from "./types";
import ipc from "./electronIpc";
export default {
  on(name: string, callback: IpcListener) {
    ipc.on(name, callback);
  },
};
