export interface PostData {
  path: string;
  params: any;
}
export type Listener = (data: PostData) => Promise<any>;

export interface MiddlewareContext {
  path: string;
  prefix: string;
  params: any;
}

export interface IServer {
  handle(name: string, callback: Listener): void;
}

export interface MiddlewareItem {
  prefix: string;
  callback: (ctx: MiddlewareContext, next: Function) => void;
}
