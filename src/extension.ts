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
      this.openNow(uri);
    });
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  openNow(uri: vscode.Uri){
    if (!uri || !uri.scheme) { // uri isn't a real URI. This means that the user called the action within the editor
      let editor = vscode.window.activeTextEditor;
      if (!editor || !editor.document.uri) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
      }
      uri = editor.document.uri;
    }

    try {
      opn(decodeURIComponent(uri.toString()));
    }
    catch (error) {
      vscode.window.showInformationMessage('Couldn\'t open file.');
      console.error(error.stack);
    }
  }
}
