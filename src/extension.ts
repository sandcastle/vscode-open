import * as vscode from 'vscode';
const opn = require('opn');

/**
 * Activates the extension.
 */
export function activate(context: vscode.ExtensionContext) {
  const controller = new OpenController();
  context.subscriptions.push(controller);
}

/**
 * Controller for handling file opens.
 */
class OpenController {

  private _disposable: vscode.Disposable;

  constructor() {

    let subscriptions: vscode.Disposable[] = [];
    let disposable = vscode.commands.registerCommand('extension.open', (uri: vscode.Uri) => {
      this.open(uri);
    });
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  private open(uri: Uri){

    if (uri && uri.scheme) {
      this.openFile(uri.toString());
      return;
    }

    let editor = vscode.window.activeTextEditor;
    if (editor && editor.document.uri) {
      this.openFile(editor.document.uri.toString());
      return;
    }

    vscode.window.showInformationMessage('No editor is active.');
  }

  private openFile(uri: string) {
    try {
      opn(decodeURIComponent(uri));
    }
    catch (error) {
      vscode.window.showInformationMessage('Couldn\'t open file.');
      console.error(error.stack);
    }
  }
}
