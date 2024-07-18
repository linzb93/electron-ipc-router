import { IpcListener, IpcAsyncListener } from "./types";
import ipc from "./electronIpc";
export default {
  on(name: string, callback: IpcListener) {
    ipc.on(name, callback);
  },
  handle(name: string, callback: IpcAsyncListener) {
    ipc.handle(name, callback);
  }
};