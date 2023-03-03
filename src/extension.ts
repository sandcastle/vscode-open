import * as vscode from "vscode";
import opn = require("open");

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
    const disposable = vscode.commands.registerCommand(
      "workbench.action.files.openFileWithDefaultApplication",
      (uri: vscode.Uri | undefined) => {
        this.open(uri);
      }
    );
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  dispose(): void {
    this._disposable.dispose();
  }

  private open(uri: vscode.Uri | undefined): void {
    if (uri?.scheme) {
      console.log("Opening from uri", uri.toString());
      this.openFile(uri.toString());
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor?.document.uri) {
      console.log("Opening from editor", editor.document.uri.toString());
      this.openFile(editor.document.uri.toString());
      return;
    }

    const { uri: tab_uri } = vscode.window.tabGroups.activeTabGroup.activeTab
      ?.input as {
      uri?: vscode.Uri;
    };

    if (tab_uri) {
      console.log("Opening from tab", tab_uri.toString());
      this.openFile(tab_uri.toString());
      return;
    }

    vscode.window.showInformationMessage(
      "No editor is active. Select an editor or a file in the Explorer view."
    );
  }

  private openFile(uri: string): void {
    try {
      const p = opn(decodeURIComponent(uri));
      p.then((p) => {
        p.on("exit", (n) => {
          if (n != 0) {
            vscode.window.showInformationMessage("Couldn't open file.");
          }
        });
      });
    } catch (error) {
      vscode.window.showInformationMessage("Couldn't open file.");
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  }
}
