import * as vscode from 'vscode';
import * as os from 'os';
import { spawn } from 'child_process';

/**
 * Opens the Explorer and executes the callback function
 * @param {string} path The path string to be opened in the explorer
 * @param {Function} callback Callback function to which error is passed if some error occurs
 */
export function openExplorer(path: string, callback: Function=(err: Error)=>{
    vscode.window.showErrorMessage(err.message);
}) {
    let platform: string = os.platform();

    let defaultPath = {
        'win32': '.',
        'darwin': '.',
        'linux': '.'
    }

    let commands = {
        'win32': 'explorer',
        'darwin': 'open',
        'linux': 'xdg-open'
    }
    
    if (!(platform == 'win32' || platform == 'darwin' || platform == 'linux')) {
        callback(new Error('Platform not supported'));
        return;
    }

    path = path || defaultPath[platform];
    let p = spawn(commands[platform], [path]);
    p.on('error', (err) => {
        p.kill();
        callback(new Error(`Error: the term ${commands[platform]} is not recognized as the name of a cmdlet, function, script file, or executable program.
            Please add ${commands[platform]} to your PATH environment variable.`));
        return;
    });
}