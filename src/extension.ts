import * as vscode from "vscode";
import { spawn } from 'child_process';
import * as path from 'path';
// import * as vsls from "vsls";
// import { AnimojiPageProvider } from "./animojiPageProvider";

// const SERVICE_NAME = 'vsls-emoji';

// const EMOJI_CHANGED_EVENT = 'emoji-changed';

// const emojiesMap = {
//   'neutral': '😐',
//   'happy': '😊',
//   'sad': '😥',
//   'angry': '😠',
//   'fearful': '😨',
//   'disgusted': '🤢',
//   'surprised': '😮'
// };

// let child: ChildProcess;

const ipc = require('node-ipc');

const showScreenPicker = async (onExpression: (expression: string) => void) => {
  let command = 'electron';
  let cwd = path.join(__dirname, '../face-tracking/');

  const spawnEnv = JSON.parse(JSON.stringify(process.env));

  // remove those env consts
  delete spawnEnv.ATOM_SHELL_INTERNAL_RUN_AS_NODE;
  delete spawnEnv.ELECTRON_RUN_AS_NODE;

  const sp = spawn(command, ['.'], { env: spawnEnv, cwd });

  sp.stdout.on('data', async (...data: any[]) => {
    let faceData = data.toString();
    onExpression(JSON.parse(faceData));
  });
  sp.stderr.on('data', (data: any[]) => {
      console.log(`stderr data: `, data[0].toString());
  });
  sp.on('close', (code) => {
      console.log(`child process exited with code`, code);
  });
  sp.on('error', (err) => {
      console.log(`error `, err);
  });

  return sp;
};

const showAnimojiPage = async () => {
  let command = 'electron';
  let cwd = path.join(__dirname, '../animoji-page/');

  const spawnEnv = JSON.parse(JSON.stringify(process.env));

  // remove those env consts
  delete spawnEnv.ATOM_SHELL_INTERNAL_RUN_AS_NODE;
  delete spawnEnv.ELECTRON_RUN_AS_NODE;

  const sp = spawn(command, ['.'], { env: spawnEnv, cwd, stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] });

  ipc.config.id = 'world';
  ipc.config.retry= 1500;
  ipc.config.maxConnections=1;
  ipc.config.silent = true;

  ipc.serveNet(
      function(){
          ipc.server.on(
              'handshake',
              function(data, socket){
                  // ipc.log('got a message : ', data);
                showScreenPicker((faceData: any = {}) => {
                    ipc.server.emit(
                        socket,
                        'vsls-data',
                        faceData
                    );
                });
              }
          );

          ipc.server.on(
              'socket.disconnected',
              function(data,socket){
                  console.log('DISCONNECTED\n\n',arguments);
              }
          );
      }
  );

  ipc.server.on(
      'error',
      function(err){
          ipc.log('Got an ERROR!',err);
      }
  );

  ipc.server.start();

  // setTimeout(() => {
  //   sp.send('message', (err: any) => {
  //     console.log(err);
  //   });
  // }, 4000);

  sp.stdout.on('data', async (...data: any[]) => {
    // let faceData = data.toString();
    // onExpression(JSON.parse(faceData));
  });
  sp.stderr.on('data', (data: any[]) => {
      console.log(`stderr data: `, data[0].toString());
  });
  sp.on('close', (code) => {
      console.log(`child process exited with code`, code);
  });
  sp.on('error', (err) => {
      console.log(`error `, err);
  });

  return sp;
};

export async function activate(context: vscode.ExtensionContext) {
  // const vslsApi = (await vsls.getApi())!;

  showAnimojiPage();


  // vslsApi!.onDidChangeSession(async (e) => {
  //   // If there isn't a session ID, then that
  //   // means the session has been ended.
  //   if (!e.session.id) {
  //     child.kill();
  //     return;
  //   }

  //   let service;
  //   const isHost = e.session.role === vsls.Role.Host;
  //   if (isHost) {
  //     service = await vslsApi.shareService(SERVICE_NAME);
  //   } else {
  //     service = await vslsApi.getSharedService(SERVICE_NAME);
  //   }

  //   service.onNotify(EMOJI_CHANGED_EVENT, (args: any) => {
  //     const { sessionId, emoji } = args;
  //     (vslsApi as any).setUserSessionEmoji(`${sessionId}`, emoji);
  //   });

  //   if (!isHost) {
  //     child = await showScreenPicker((expression: string = '') => {
  //       const emoji = emojiesMap[expression.trim()] + ' ';
  //       const sessionId = vslsApi.session.peerNumber;

  //       service.notify(EMOJI_CHANGED_EVENT, {
  //         sessionId,
  //         emoji
  //       });
  //     });
  //   }
  // });
}

export function deactivate() {}
