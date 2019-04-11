import * as vscode from "vscode";
import * as path from 'path';
import { spawn } from 'child_process';
// import { exec, ChildProcess } from 'child_process';
// import * as vsls from "vsls";

// const SERVICE_NAME = 'vsls-emoji';

// const emojiesMap = {
//   'neutral': '😐',
//   'happy': '😊',
//   'sad': '😥',
//   'angry': '😠',
//   'fearful': '😨',
//   'disgusted': '🤢',
//   'surprised': '😮'
// };

// const EMOJI_CHANGED_EVENT = 'emoji-changed';

// let child: ChildProcess;

const showScreenPicker = async () => {
  let command = 'electron';
  let cwd = path.join(__dirname, '../screen-viewer-electron/');

  const spawnEnv = JSON.parse(JSON.stringify(process.env));

  // remove those env consts
  delete spawnEnv.ATOM_SHELL_INTERNAL_RUN_AS_NODE;
  delete spawnEnv.ELECTRON_RUN_AS_NODE;

  const sp = spawn(command, ['.'], { env: spawnEnv, cwd });

  sp.stdout.on('data', async (...data: any[]) => {
    console.log('data');
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
};

export async function activate(context: vscode.ExtensionContext) {
  await showScreenPicker();






  // const vslsApi = (await vsls.getApi())!;

  // vslsApi!.onDidChangeSession(async (e) => {
  //   // If there isn't a session ID, then that
  //   // means the session has been ended.
  //   if (!e.session.id) {
  //     child.kill();
  //     return;
  //   }

  //   let service;
  //   if (e.session.role === vsls.Role.Host) {
  //     service = await vslsApi.shareService(SERVICE_NAME);
  //   } else {
  //     service = await vslsApi.getSharedService(SERVICE_NAME);
  //   }

  //   service.onNotify(EMOJI_CHANGED_EVENT, (args: any) => {
  //     const { sessionId, emoji } = args;
  
  //     vslsApi.setUserSessionEmoji(`${sessionId}`, emoji);
  //   });
  
  //   child = exec('node ./test.js', { cwd: __dirname, env: process.env }, (...args: any[]) => {});
  
  //   child.stdout.on('data', (data: string) => {
  //     try {
  //       const prediction = JSON.parse(data);
  //       if (prediction && (prediction.probability != null)) {
  //         const emoji = emojiesMap[prediction.expression] + ' ';
  //         const sessionId = vslsApi.session.peerNumber;
  
  //         service.notify(EMOJI_CHANGED_EVENT, {
  //           sessionId,
  //           emoji
  //         });
  
  //         console.log(vslsApi.session.peerNumber, emoji, prediction);
  //       } else {
  //         console.log(`failed to parse prediction.`);
  //       }
  //     } catch (e) {
  //       // ignore
  //     }
  //   });


  // });
}

export function deactivate() {}
