import ipcRenderer from "./ipcRenderer";
import { IPC_ROUTER_EVENT_KEY } from './constant';

const request = async (path: string, data: any) => {
    return await ipcRenderer.invoke(IPC_ROUTER_EVENT_KEY, {
        path,
        data,
    });
};

request.send = (path: string, data: any) => {
    ipcRenderer.send(IPC_ROUTER_EVENT_KEY, {
        path,
        data,
    });
};

export default request;