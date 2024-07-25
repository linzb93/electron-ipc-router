import Application from "./application";
export { default as Route } from "./Route";
import { EVENT_ROUTER_KEY } from "./constant";
import { PostData, Listener, MiddlewareContext } from "./types";
interface IServer {
  handle(name: string, callback: Listener): void;
}

export const createServer = (server: IServer) => new Application(server);

interface IClient {
  invoke(name: string, data: PostData): Promise<any>;
}

export const createClient =
  (client: IClient) => async (path: string, params: any) =>
    await client.invoke(EVENT_ROUTER_KEY, { path, params });

// 单元测试用
export type { Application, MiddlewareContext, PostData };
