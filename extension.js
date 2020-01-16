

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
var func = require('./functions.js');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Команда начала работы
	let panel;

	let disposable = vscode.commands.registerCommand('extension.StartApp', function () {
		vscode.window.showInformationMessage("Creation of specialized applications for boards. Let's start!");
		//The path module provides utilities for working with file and directory paths.
		let path = require('path');

		//Создадим окно с возможностью выбора параметров:
	 	panel = vscode.window.createWebviewPanel(
			'NewProject',
			'New Project',
			vscode.ViewColumn.One,
			{ 
				enableScripts: true ,
				// Only allow the webview to access resources in our extension's media directory
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'forms'))]
			}
		);
		//Download main form
		try{
			//Основной файл html
			const mainformPath = vscode.Uri.file(path.join(context.extensionPath, 'forms', 'MainForm.html')); 
			
			let data = fs.readFileSync(mainformPath.fsPath, 'utf8');

			//Подключаем файлы
			//jquery
			let FilePath = vscode.Uri.file(path.join(context.extensionPath, 'forms','jquery', 'jquery-3.4.1.js')); 
			let Uri = panel.webview.asWebviewUri(FilePath);
			data = data.replace("${jquery}", Uri);

			FilePath = vscode.Uri.file(path.join(context.extensionPath, 'forms','jquery', 'jquery-ui.js')); 
			Uri = panel.webview.asWebviewUri(FilePath);
			data = data.replace("${jquery-ui}", Uri);

			//css
			FilePath = vscode.Uri.file(path.join(context.extensionPath, 'forms', 'css', 'style.css')); 
			Uri = panel.webview.asWebviewUri(FilePath);
			data = data.replace("${cssUri}", Uri);
			
			FilePath = vscode.Uri.file(path.join(context.extensionPath, 'forms',  'css','jquery-ui.css')); 
			Uri = panel.webview.asWebviewUri(FilePath);
			data = data.replace("${jquerycssUri}", Uri);

			panel.webview.html = data;
		}catch(err){
			func.Log(vscode, 0, err.message);
			throw err
		}

		//Make callback from form
		panel.webview.onDidReceiveMessage(
			message => {
				if( func.CheckJson(vscode, panel, message))
				{
					func.CreateFiles(context, vscode,  message.json);
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);

}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
