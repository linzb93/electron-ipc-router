export declare class Application {
    private listenerDatabase;
    private middlewareDatabase;
    private errorHandler;
    constructor();
    /**
     * 以发布/订阅模式监听
     * @param {string} path - 路径，以`-`符号间隔
     * @param {Function} callback - (data: any) => void 回调函数
     */
    on(path: string, callback: Listener): void;
    /**
     * 以Promise模式监听
     * @param {string} path - 路径，以`-`符号间隔
     * @param {Function} callback - (data: any) => void 回调函数
     */
    handle(path: string, callback: Listener): void;
    /**
     * 移除所有监听事件。每个单元测试结束后一定要调用，否则下一个同名的监听事件不会触发。
     * @param {string} path - 事件名称
     */
    removeAllListeners(path: string): void;
    /**
     * 移除所有中间件，每个单元测试结束后一定要调用。
     */
    removeAllMiddlewares(): void;
    /**
     * 注册中间件。
     * @param middleware - 中间件处理函数
     */
    use(middleware: (ctx: MiddlewareContext, next: Function) => any): void;
    /**
     * 注册中间件。
     * @param path - 中间件对应的路径前缀
     * @param middleware - 中间件处理函数
     */
    use(path: string, middleware: (ctx: MiddlewareContext, next: Function) => any): void;
    /** */
    catch(errorHandler: (error: Error, path: string) => any): void;
    private routerNextHandler;
}

declare const _default: {
    create(): Application;
};
export default _default;

declare type Listener = (data: any) => void;

declare interface MiddlewareContext {
    path: string;
}

export declare const request: {
    (path: string, data: any): Promise<any>;
    send(path: string, data: any): void;
};

export declare const Route: () => {
    (ctx: MiddlewareContext, next: Function): void;
    on(path: string, callback: Listener): void;
    handle(path: string, callback: Listener): void;
};

export { }
