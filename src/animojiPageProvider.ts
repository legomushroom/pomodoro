import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';

export class AnimojiPageProvider {
    private readonly onDidChangeInternal: vscode.EventEmitter<vscode.Uri> = new vscode.EventEmitter<vscode.Uri>();
    
    public readonly onDidChange: vscode.Event<vscode.Uri> = this.onDidChangeInternal.event;

    public update(uri: vscode.Uri) {
        this.onDidChangeInternal.fire(uri);
    }

    public provideTextDocumentContent(nonce: string, scripts: any): string {
        // const extensionDir = path.resolve(__dirname, '../');
        // const animojiPageDir = path.join(extensionDir, './animoji-page/');
        // let contents = fs.readFileSync(path.join(animojiPageDir, 'index.html')).toString();

        // Create a nonce to whitelist which scripts & styles can be run
        

        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>three.js webgl - glTF loader</title>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
                    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
                </head>
            
                <body style="font-family: Monospace; background-color: #000; color: #fff; margin: 0px; overflow: hidden;">
                    <script nonce="${nonce}" src="${scripts.threeJS}"></script>
            
                    <script nonce="${nonce}" src="${scripts.OrbitControls}"></script>
                    <script nonce="${nonce}" src="${scripts.GLTFLoader}"></script>
            
                    <script nonce="${nonce}" src="${scripts.WebGL}"></script>
                    <script nonce="${nonce}" src="${scripts.stats}"></script>
            
                    <script nonce="${nonce}" src="${scripts.main}"></script>
            
                </body>
            </html>
        
        `;
    }
}