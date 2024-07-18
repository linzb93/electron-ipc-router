export type Listener = (data: any) => void;
export type IpcListener = (event: any, data: any) => void;
export type IpcAsyncListener = (event: any, data: any) => Promise<any>;
export interface IpcData {
  path: string;
  data: any;
}

export interface MiddlewareContext {
  path: string;
}
