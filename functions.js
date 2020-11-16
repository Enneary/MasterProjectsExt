let path = require('path');
let fs = require('fs');
let os = require('os');
var dict = require('./temp/template.js');
const { Uri } = require('vscode');
const { url } = require('inspector');

//вызов со стороны формы-клиента
function CheckJson(vscode, panel, message){
    switch (message.command) {
        case 'info': //вывести информационное окно
            Log(vscode,  1, message.text);
            return false;
        case 'error': //вывод ошибки
            Log(vscode,  0, message.text);
            return false;
        case 'openFolderDialog': //открыть диалог выбора папки
            OpenFolderDialog(vscode, panel, message.type);
            return;
        case 'createDir'://создать проект по шаблону, проверка корректности пришедших параметров
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
            /*if(!res.CompilerPath){
                Log(vscode,  0, 'You should specify the path to the compiler!');
                return false;
            }*/
            return true;
        default:
            Log(vscode,  0, 'Unknown command!');
            return false;
        
    }
}

//открытие диалога выбора папки
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
//создание файлов проекта
function CreateFiles(context, vscode, res){
    //Настройка Cmake в соответсвии с системой пользователя
    res["cmake_generator"] = "";
    res["mc_bin"] ="";
    if(os.platform() == "win32"){
        res["cmake_generator"] = "MinGW Makefiles"
        res["mc_bin"] = "bin";
    }else if (os.platform() == "linux"){
        res["cmake_generator"] = "Ninja";
        res["mc_bin"] = "run/make";
    }

    //Создаем папку проекта
    let newDir = path.join(res.DirPath, res.ProjectName);
    if (!fs.existsSync(newDir)){
        fs.mkdir(newDir, { recursive: true }, (err) => {
            if (err) {
                Log( 0, err.message);
                throw err
            }else{
                //Копируем туда все файлы шаблона
                let tempDir = path.join(context.extensionPath, "temp", res.BoardId.toUpperCase());
                let tempDict = dict.Dictionary[res.BoardId];
                copyFolderRecursiveSync(tempDir, newDir, tempDict, res, true);
                vscode.window.showInformationMessage('Directory created successfully!');
                vscode.commands.executeCommand("vscode.openFolder", Uri.file(newDir), true); //vscode.openFolder(newDir, true); //3.commands.executeCommand('vscode.openFolder', newDir);
            }
        });
    }else{
        Log(vscode, 0, 'Directory already exist!');
        return;
    }
}
function copyFolderRecursiveSync(source, target, tempDict, res, first){
    var files = [];
    var targetFolder = "";
    if(first)
        targetFolder = target; 
    else
        targetFolder = path.join( target, path.basename( source ) );
    
    //check if folder needs to be created or integrated
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }
    //}
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

    //if target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    let ext = path.extname(source);
    let data = fs.readFileSync(source, 'utf8');
    if(tempDict){
        if(tempDict[path.basename(source)]) {
            
            tempDict[path.basename(source)].forEach(element => {
                data = data.replace(new RegExp("{" + element + "}", 'g'), res[element].replace(new RegExp('\\\\', 'g'), '/'));
            });
            
        } 
        if(os.platform() == 'linux' && (ext == '.json' || ext == '.txt' || ext == '.cmake')){
            data = data.replace(new RegExp("[.]exe", 'g'), "");
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