# Electron-ipc-router

Electron-ipc-router 是在 Electron 中使用，api 模仿 koa 的方式，旨在解决主进程中`ipcMain`管理混乱的问题。API和 ipcMain 与 ipcRenderer 类似。

## 安装

```bash
npm i @linzb93/electron-ipc-router
```

## 主进程使用

```js
import ipcMainRouter from "@linzb93/electron-ipc-router";

// 管理所有的ipcMain监听事件
const ipcMain = ipcMainRouter.create();

ipcMain.handle("user/get", async (body) => await getListFromDatabase(body));
```

### Route

像 koa 一样，为了方便管理，可以为相同路径前缀的监听器创建一个`Route`子模块。

```js
import ipcMainRouter, { Route } from "@linzb93/electron-ipc-router";

const ipcMain = ipcMainRouter.create();
const router = Route();
router.handle("user/get", async (ctx) => await getListFromDatabase(ctx.body));
ipcMain.use("api", router);
```

### 中间件

中间件可以在 ipc 路由处理程序之前和之后处理逻辑，支持异步调用。

```js
import ipcMainRouter, { Route } from "@linzb93/electron-ipc-router";
import dayjs from "dayjs";

const ipcMain = ipcMainRouter.create();
ipcMain.use(async (ctx, next) => {
  console.log(
    `route: ${ctx.path}, time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`
  );
  await next();
  console.log("response sent");
});
```

### 错误处理

`electron-ipc-router`虽然有内置的全局错误处理，但是也可以自定义全局错误处理，或者单个`Route`模块下的错误处理。

```js
import ipcMainRouter, { Route } from "@linzb93/electron-ipc-router";

const ipcMain = ipcMainRouter.create();
// 全局错误处理
ipcMain.catch((ctx, error) => {
  console.log(`${ctx.path}错误：${error.message}`);
});

// 单个 Route 模块下的错误处理
const router = Route();
router.catch((ctx, error) => {
  console.log(`${ctx.path}错误：${error.message}`);
});
```

## 渲染进程使用

```js
import { request } from "@linzb93/electron-ipc-router";
(async () => {
  const users = await request("/api/user/get", {
    age: 30,
  });
  console.log(users);
})();
```
