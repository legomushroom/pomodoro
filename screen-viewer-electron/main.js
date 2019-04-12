const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');

let mainWindow;
let url;

ipcMain.on('vsls-expression-update', (event, expression) => {
  console.log(expression);
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 400, height: 300});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.once("did-finish-load", function () {});
});
