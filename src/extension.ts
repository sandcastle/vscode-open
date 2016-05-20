import * as vscode from 'vscode';
const open = require('open');

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
    let disposable = vscode.commands.registerCommand('extension.open', () => {
      this.openNow();
    });
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  openNow(){

    let editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.uri) {
      vscode.window.showInformationMessage('No editor is active.');
      return;
    }

    try {
      open(decodeURIComponent(editor.document.uri.toString()));
    }
    catch (error) {
      vscode.window.showInformationMessage('Couldn\'t open file.');
      console.error(error.stack);
    }
  }
}
