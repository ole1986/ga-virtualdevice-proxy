import { CommandBase } from "./protected/CommandAbstract";
import * as fetch from 'node-fetch';
import * as btoa from 'btoa';
import { CommandFactory } from "./protected/CommandFactory";

export class CommandLightFhemGeneric extends CommandBase {
    public async runCommand() {
        try {
            let config = this.getFHEMConfig();

            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            // build commands
            var cmdList = [];

            var OnOff = params.on ? 'on': 'off';

            devices.forEach(item => {
                cmdList.push('set '+item.fhem_device +' ' + OnOff);
            });

            var command = cmdList.join(' ; ');
            var urlWithParams = config.url + '?cmd=' + encodeURI(command) + '&XHR=1&fwcsrf=' + config.csrf;

            console.log("### Executing " + config.url + " with command '" + command + "'...");
            let headers = {};
            if (config.username && config.password) {
                var b64code = btoa(config.username + ":" + config.password);
                headers['Authorization'] = 'Basic ' + b64code;
                console.log('### Using authentication');
            }

            let result: Response = await fetch(urlWithParams, { method: 'GET', headers: headers });

            if (result.status !== 200) {
                throw result.status + ' ' + result.statusText;
            }
            
            await this.sendResponse();

            return true;
        } catch (err) {
            console.error(this.getModuleName() + ': ' + err);
        }
        return false;
    }

    public async sendResponse() {
        var config = this.getFHEMConfig();
        var devices = this.getDevices();

        var command = "{ ReadingsVal(\""+ devices[0].fhem_device +"\", \"state\", \"\") }";

        var urlWithParams = config.url + '?cmd=' + encodeURI(command) + '&XHR=1&fwcsrf=' + config.csrf;
        
        console.log("### Querying " + config.url + " with command '" + command + "'...");
        let headers = {};
        if (config.username && config.password) {
            var b64code = btoa(config.username + ":" + config.password);
            headers['Authorization'] = 'Basic ' + b64code;
            console.log('### Using authentication');
        }

        let result: Response = await fetch(urlWithParams, { method: 'GET', headers: headers });

        if (result.status !== 200) {
            throw result.status + ' ' + result.statusText;
        }

        let textResult = await result.text();

        let queryResult = {
            on: textResult.indexOf('on') !== -1 ? true : false
        };

        CommandFactory.Proxy.SendStatus(queryResult);
    }
}