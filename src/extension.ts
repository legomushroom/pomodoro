import * as vscode from "vscode";
import { ChildProcess, spawn } from 'child_process';
import * as path from 'path';
import * as vsls from "vsls";

const SERVICE_NAME = 'vsls-emoji';

const EMOJI_CHANGED_EVENT = 'emoji-changed';

const emojiesMap = {
  'neutral': '😐',
  'happy': '😊',
  'sad': '😥',
  'angry': '😠',
  'fearful': '😨',
  'disgusted': '🤢',
  'surprised': '😮'
};

let child: ChildProcess;

const showScreenPicker = async (onExpression: (expression: string) => void) => {
  let command = 'electron';
  let cwd = path.join(__dirname, '../screen-viewer-electron/');

  const spawnEnv = JSON.parse(JSON.stringify(process.env));

  // remove those env consts
  delete spawnEnv.ATOM_SHELL_INTERNAL_RUN_AS_NODE;
  delete spawnEnv.ELECTRON_RUN_AS_NODE;

  const sp = spawn(command, ['.'], { env: spawnEnv, cwd });

  sp.stdout.on('data', async (...data: any[]) => {
    const expression = data.toString();
    onExpression(expression);
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
  const vslsApi = (await vsls.getApi())!;

  vslsApi!.onDidChangeSession(async (e) => {
    // If there isn't a session ID, then that
    // means the session has been ended.
    if (!e.session.id) {
      child.kill();
      return;
    }

    let service;
    const isHost = e.session.role === vsls.Role.Host;
    if (isHost) {
      service = await vslsApi.shareService(SERVICE_NAME);
    } else {
      service = await vslsApi.getSharedService(SERVICE_NAME);
    }

    service.onNotify(EMOJI_CHANGED_EVENT, (args: any) => {
      const { sessionId, emoji } = args;
      (vslsApi as any).setUserSessionEmoji(`${sessionId}`, emoji);
    });

    if (!isHost) {
      child = await showScreenPicker((expression: string = '') => {
        const emoji = emojiesMap[expression.trim()] + ' ';
        const sessionId = vslsApi.session.peerNumber;

        service.notify(EMOJI_CHANGED_EVENT, {
          sessionId,
          emoji
        });
      });
    }
  });
}

export function deactivate() {}
