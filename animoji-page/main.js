const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');
const ipc = require('node-ipc');

let mainWindow;
let url;

// ipcMain.send('vsls-animoji-data', data);
  

// process.on('message', (message) => {
  
//   // console.log('message from parent:', message);
// });

// ipcMain.on('vsls-expression-update', (event, expression) => {
//   console.log(expression);
// });

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 640, height: 480, x: 0, y: 0});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.once("did-finish-load", function () {});
});
