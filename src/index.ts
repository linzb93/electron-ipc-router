import Application from "./application";
import ipcRenderer from "./ipcRenderer";
const ipcRouter = {
  create() {
    return new Application();
  },
};

export const request = async (name: string, data: any) => {
  return await ipcRenderer.invoke("api", {
    name,
    data,
  });
};

export default ipcRouter;
export { Application };
