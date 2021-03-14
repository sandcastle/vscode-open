import * as vscode from 'vscode';
import opn = require('opn');

/**
 * Activates the extension.
 */
export function activate(context: vscode.ExtensionContext): void {
  const controller = new OpenController();
  context.subscriptions.push(controller);
}

/**
 * Controller for handling file opens.
 */
class OpenController implements vscode.Disposable {

  private _disposable: vscode.Disposable;

  constructor() {

    const subscriptions: vscode.Disposable[] = [];
    const disposable = vscode.commands.registerCommand('workbench.action.files.openFileWithDefaultApplication', (uri: vscode.Uri | undefined) => {
      this.open(uri);
    });
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  dispose(): void {
    this._disposable.dispose();
  }

  private open(uri: vscode.Uri | undefined): void {

    if (uri?.scheme) {
      this.openFile(uri.toString());
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor?.document.uri) {
      this.openFile(editor.document.uri.toString());
      return;
    }

    vscode.window.showInformationMessage('No editor is active. Select an editor or a file in the Explorer view.');
  }

  private openFile(uri: string): void {
    try {
      opn(decodeURIComponent(uri));
    }
    catch (error) {
      vscode.window.showInformationMessage('Couldn\'t open file.');
      console.error(error.stack);
    }
  }
}
