import * as fetch from 'node-fetch';
import * as btoa from 'btoa';
import * as config from '../../config.json';
import { CommandBase } from './CommandAbstract.js';

export class CommandFhem extends CommandBase {

    public getFHEMConfig() {
        var fhemConfig = config["fhem"];

        if(!fhemConfig.url) throw 'FHEM url missing in configuration';
        if(!fhemConfig.csrf) throw 'FHEM csrf missing in configuration';
        if(fhemConfig.username && !fhemConfig.password) throw 'FHEM password missing in configuration';

        return fhemConfig;
    }

    protected async requestFHEM(command: string): Promise<string> {
        var config = this.getFHEMConfig();

        let headers = {};
        if (config.username && config.password) {
            var b64code = btoa(config.username + ":" + config.password);
            headers['Authorization'] = 'Basic ' + b64code;
        }

        console.log("### Executing " + config.url + " with command '" + command + "'...");

        var urlWithParams = config.url + '?cmd=' + encodeURI(command) + '&XHR=1&fwcsrf=' + config.csrf;

        let result = await fetch(urlWithParams, { method: 'GET', headers: headers });
        return await result.text();
    }

    private parseReadings(readings: Array<string>): Array<object> {
        return readings.map(x => {
            if(x.indexOf('on') !== -1) {
                return { on: true };
            } else {
                return { on: false };
            }
        });
    }

    public async queryStatus(): Promise<object> {
        let devices = this.getDevices();

        let deviceResponseStruct = {
            online: true // assume the device is always available
        };

        let cmdList = [];
        let result = {};
        
        devices.forEach(x => {
            cmdList.push("ReadingsVal(\""+ x.fhem_device +"\", \"state\", \"\")");
        });

        var command = "{ " + cmdList.join('."|"') + " }";

        let content = await this.requestFHEM(command);
        var contentParts = content.split('|');
        let parsedReadings = this.parseReadings(contentParts);

        for(var i in devices) {
            result[devices[i].id] = Object.assign(parsedReadings[i], deviceResponseStruct);
        }

        return result;
    }
}