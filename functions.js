let path = require('path');
let fs = require('fs');
var dict = require('./temp/template.js');

function CheckJson(vscode, panel, message){
    switch (message.command) {
        case 'info':
            Log(vscode,  1, message.text);
            return false;
        case 'error':
            Log(vscode,  0, message.text);
            return false;
        case 'openFolderDialog':
            OpenFolderDialog(vscode, panel, message.type);
            return;
        case 'createDir':
            let res = message.json;
            if(!res){
                Log(vscode,  0, 'No JSON param!');
                return false;
            }
            if(!res.ProjectName){
                Log( vscode, 0, 'Project Name name could not be empty!');
                return false;
            }
            if(!res.DirPath){
                Log(vscode,  0, 'Directory name could not be empty!');
                return false;
            }
            if(!res.CompilerPath){
                Log(vscode,  0, 'You should specify the path to the compiler!');
                return false;
            }
            return true;
        default:
            Log(vscode,  0, 'Unknown command!');
            return false;
        
    }
}
function OpenFolderDialog(vscode, panel, type){
    vscode.window.showOpenDialog({
        canSelectMany: false,
        canSelectFolders: true,
        openLabel: 'Select',
        filters: {
           'All files': ['*']
       }
    }).then(fileUri => {
        panel.webview.postMessage({ command: 'responseFolderPath', folderPath: fileUri[0].fsPath , type : type});
    });
}
function CreateFiles(context, vscode, res){
    //Создаем папку проекта
    let newDir = path.join(res.DirPath, res.ProjectName);
    if (!fs.existsSync(newDir)){
        fs.mkdir(newDir, { recursive: true }, (err) => {
            if (err) {
                Log( 0, err.message);
                throw err
            }else{
                vscode.window.showInformationMessage('Directory created successfully!');
                //Копируем туда все файлы шаблона
                let tempDir = path.join(context.extensionPath, "temp", res.BoardId.toUpperCase());
                let tempDict = dict.Dictionary[res.BoardId];
                copyFolderRecursiveSync(tempDir, newDir, tempDict, res, true);

            }
        });
    }else{
        Log( 0, 'Directory already exist!');
        return;
    }
}
function copyFolderRecursiveSync(source, target, tempDict, res, first){
    var files = [];
    if(!first){
    //check if folder needs to be created or integrated
        var targetFolder = path.join( target, path.basename( source ) );
        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }
    }
    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder, tempDict, res, false );
            } else {
                copyFileSync( curSource, targetFolder, tempDict, res);
            }
        } );
    }
}

function copyFileSync( source, target, tempDict, res ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    let data = fs.readFileSync(source, 'utf8');
    if(tempDict){
        
        if(tempDict[path.basename(source)]) {
            
            tempDict[path.basename(source)].forEach(element => {
                data = data.replace(new RegExp("{" + element + "}", 'g'), res[element].replace(new RegExp('\\\\', 'g'), '/'));
            });
            
        } 
    } 
    fs.writeFileSync(targetFile, data);
}

//logging 
function Log(vscode, type, msg){
	let msgType = '';
	switch(type){
		case 0: 
			msgType = "Error";
			vscode.window.showErrorMessage(msgType + ': ' + msg);
			return;
		case 1:
			msgType = "Info";
			vscode.window.showInformationMessage(msgType + ': ' + msg);
			return;
		case 2: 
			msgType = "Other";
			vscode.window.showInformationMessage(msgType + ': ' + msg);
            return;
        default:
            msgType = "Error";
			vscode.window.showErrorMessage(msgType + ': ' + msg);
			return;
	}
}

module.exports = {
    CheckJson,
    CreateFiles,
    Log
}