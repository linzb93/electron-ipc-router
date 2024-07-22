export type Listener = (data: any) => void;
export type IpcListener = (event: any, data: string) => Promise<any>;
export interface IpcData {
  path: string;
  data: any;
}

export interface MiddlewareContext {
  path: string;
  params: any;
}
