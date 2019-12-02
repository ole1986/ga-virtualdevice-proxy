import * as WebSocket from 'ws';
import { CommandFactory } from './CommandFactory';
import * as config from '../../config.json';

export class AssistantProxyClient extends WebSocket {
    private _version: number = 3;
    private _responseTimeout: number = 10; // abort connection when ping response took to long
    private _keepAliveInterval: number = 60 * 5; // requesting KeepAlive every 5 minutes
    private _timeoutTimer;
    private _timer;

    constructor() {
        super(config.REMOTE_HOST);

        this.on('connectFailed', err => {
            clearInterval(this._timer);
            console.log('Connect Error: ' + err.toString());
        });
        this.on('error', err =>  {
            clearInterval(this._timer);
            console.error(err);
        });

        this.on('open', this.loginUser);
        this.on('pong', () => this.KeepAlive());
        this.on('close', (code, msg) => {
            clearInterval(this._timer);
            console.log('Connection closed. ' + msg);
        });

        this.on('message', (x) => this.parseMessage(x));
        
        this._timer = setInterval(() => this.pingServer(), this._keepAliveInterval * 1000);

        CommandFactory.Proxy = this;
    }

    public KeepAlive() {
        clearTimeout(this._timeoutTimer);
        console.log("KeepAlive");
    }

    private pingServer() {
        this.ping();
        this._timeoutTimer = setTimeout( () => { 
            console.log("Connection timed out");
            this.terminate();
            process.exit();
        }, this._responseTimeout * 1000);
    }

    private async parseMessage(data: WebSocket.Data) {
        let cmd = data.slice(0, 4);
        let msg = data.slice(5);
        let moduleClass;

        switch (cmd) {
            default:
                break;
            case 'QUER':
                moduleClass = CommandFactory.resolveModule(msg.toString());
                await moduleClass.sendStatus();
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
        let data = {
            USER_ID: config.USER_ID,
            PRIMARY: config.PRIMARY,
            VERSION: this._version,
        }
        this.send('LOGN ' + JSON.stringify(data));
    }

    public SendStatus(text: object) {
        this.send('STAT ' + JSON.stringify(text));
    }
}