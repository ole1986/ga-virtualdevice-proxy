import * as WebSocket from 'ws';
import * as config from './config.json';
import { CommandFactory } from './lib/protected/CommandFactory';
import { basename } from 'path';

if(!config) {
   console.error("No configuration found"); 
   process.exit(1);
}

if(!config.REMOTE_HOST) {
    console.error("No REMOTE_HOST defined");
    process.exit(1);
}

if(!config.USER_ID) {
    console.error("No USER_ID defined");
    process.exit(1);
}


export class AssistantProxyClient extends WebSocket {
    constructor() {
        super(config.REMOTE_HOST);

        this.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
        });
        
        this.on('open', this.loginUser);
        
        this.on('error', function(err) {
            console.error(err);
        });
        
        this.on('close', function () {
            console.log('Connection closed');
        });
        
        this.on('message', (x) => this.parseMessage(x));
    }

    private async parseMessage(data: WebSocket.Data) {
        let cmd = data.slice(0, 4);
        let msg = data.slice(5);

        switch(cmd) {
            default:
                break;
            case 'LOOK':
                console.log("login ok");
                break;
            case 'CMDL':
                const moduleClass = CommandFactory.resolveModule(msg.toString());
                await moduleClass.runCommand();
                break;
        }
    }

    private loginUser() {
        console.log('Logging in...');
        this.send('LOGN ' + config.USER_ID);
    }
}

new AssistantProxyClient();