import Application from "./application";
import ipcRenderer from "./ipcRenderer";
export { default as Route } from "./Route";

const ipcRouter = {
  create() {
    return new Application();
  },
};

export const request = async (path: string, data: any) => {
  return await ipcRenderer.invoke("api", {
    path,
    data,
  });
};

request.send = (path: string, data: any) => {
  ipcRenderer.send("api", {
    path,
    data,
  });
};

export default ipcRouter;
export { Application };
