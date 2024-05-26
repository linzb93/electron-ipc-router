import Application from "./application";
import ipcRenderer from "./ipcRenderer";
const ipcRouter = {
  create() {
    return new Application();
  },
};

export const request = (name: string, data: any) => {
  ipcRenderer.send("api", {
    name,
    data,
  });
};

export default ipcRouter;
export { Application };
