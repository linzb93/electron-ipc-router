// import {ipcMain as rawIpcMain} from 'electron';

// const ipcMain = {
//     handle(name, callback) {
//         return rawIpcMain.handle(name, async (_, dataStr) => {
//             return await callback(JSON.parse(dataStr));
//         });
//     }
// }

// const app = eventRouter.createServer(ipcMain);