# event-router

event-router 是 api 模仿 koa 的方式，旨在解决进程中路由管理混乱的问题。API 和 Electron 中的 ipcMain 与 ipcRenderer 类似。

## 安装

```bash
npm i @linzb93/event-router
```

## 服务端使用

```ts
import { createServer } from "@linzb93/event-router";
// 以Electron的ipcMain为例
import { ipcMain } from "electron";
const app = createServer({
  handle(name: string, callback: Function) {
    return ipcMain.handle(name, async (_, dataStr) => {
      return await callback(JSON.parse(dataStr));
    });
  },
});

app.handle("user-get", async (request) => await getListFromDatabase(request));
```

### Route

像 koa 一样，为了方便管理，可以为相同路径前缀的监听器创建一个`Route`子模块。

```js
import { Route } from "@linzb93/event-router";

const router = Route();
router.handle(
  "user-get",
  async (request) => await getListFromDatabase(request)
);
app.use("api", router);
```

### 中间件

中间件可以在路由处理程序之前和之后处理逻辑，支持异步调用。

```js
import { Route } from "@linzb93/event-router";
import dayjs from "dayjs";

app.use(async (ctx, next) => {
  console.log(
    `route: ${ctx.path}, time: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`
  );
  await next();
  console.log("response sent");
});
```

### 错误处理

`event-router`虽然有内置的全局错误处理，但是也可以自定义全局错误处理，或者单个`Route`模块下的错误处理。

```js
// 全局错误处理
app.catch((path, error) => {
  console.log(`${path}错误：${error.message}`);
});
```

## 渲染进程使用

以 Electron 的 ipcRenderer 为例。

```js
import { createClient } from "@linzb93/event-router";
(async () => {
  const request = createClient({
    invoke(name, data) {
      return window.ipcRenderer.invoke(name, JSON.stringify(data));
    },
  });
  const users = await request("api-user-get", {
    age: 30,
  });
  console.log(users);
})();
```
