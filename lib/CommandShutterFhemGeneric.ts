import { CommandBase } from "./protected/CommandAbstract";
import * as fetch from 'node-fetch';
import * as btoa from 'btoa';

export class CommandShutterFhemGeneric extends CommandBase {
    public async runCommand() {
        try {
            let config = this.getFHEMConfig();

            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            var fhem_prefix = settings.prefix;

            // build commands
            var cmdList = [];

            devices.forEach(item => {
                cmdList.push('set '+fhem_prefix + '_' + item.alias + ' pct ' + params.openPercent);
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
            return true;
        } catch (err) {
            console.error(this.getModuleName() + ': ' + err);
        }
        return false;
    }
}