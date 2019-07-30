import * as WebSocket from 'ws';
import { CommandFactory } from './CommandFactory';
import * as config from '../../config.json';

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

        CommandFactory.Proxy = this;
    }

    private async parseMessage(data: WebSocket.Data) {
        let cmd = data.slice(0, 4);
        let msg = data.slice(5);
        let moduleClass;

        switch(cmd) {
            default:
                break;
            case 'LOOK':
                console.log("login ok");
                break;
            case 'CMDL':
                moduleClass = CommandFactory.resolveModule(msg.toString());
                await moduleClass.runCommand();
                break;
        }
    }

    private loginUser() {
        console.log('Logging in...');
        this.send('LOGN ' + config.USER_ID);
    }

    public SendStatus(text: object) {
        this.send('STAT ' + JSON.stringify(text));
    }
}