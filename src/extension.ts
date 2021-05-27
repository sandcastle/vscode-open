import * as vscode from 'vscode';
import opn = require('open');

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

  private openWslFile(uri: vscode.Uri): boolean {
    if (vscode.env?.remoteName === 'wsl' && process.env?.WSL_DISTRO_NAME) {
      const baseUri = vscode.Uri.parse(`${uri.scheme}://${vscode.env.remoteName}\$/${process.env.WSL_DISTRO_NAME}`)
      this.openFile(vscode.Uri.joinPath(baseUri, uri.fsPath).toString());
      return true;
    }
    return false;
  }

  private open(uri: vscode.Uri | undefined): void {

    if (uri?.scheme) {
      if (this.openWslFile(uri)) {
        return;
      }

      this.openFile(uri.toString());
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor?.document.uri) {
      if (this.openWslFile(editor.document.uri)) {
        return;
      }

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
