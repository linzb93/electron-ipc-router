export type Listener = (data: any) => void;
export type IpcListener = (event: any, data: any) => void;
export type IpcAsyncListener = (event: any, data:any) => Promise<any>;
export interface IpcData {
  name: string;
  data: any;
}
