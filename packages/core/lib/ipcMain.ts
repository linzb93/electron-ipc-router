import { IpcListener } from "./types";
import ipc from "./electronIpc";
export default {
  handle(name: string, callback: IpcListener) {
    ipc.handle(name, callback);
  },
};
