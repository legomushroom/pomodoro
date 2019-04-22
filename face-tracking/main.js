const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');

let mainWindow;
let url;

ipcMain.on('vsls-face-data', (event, faceData) => {
  console.log(faceData);
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 640, height: 480, y: 0, x: 700});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.once("did-finish-load", function () {});
});
