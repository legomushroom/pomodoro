const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');

let mainWindow;
let url;

ipcMain.on('share screen', (event, port) => {
  console.log(`[shared:${port}]`);
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.once("did-finish-load", function () {});
});
