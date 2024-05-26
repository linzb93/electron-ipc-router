export type Listener = (data: any) => void;
export type IpcListener = (event: any, data: any) => void;
export interface IpcData {
  name: string;
  data: any;
}
