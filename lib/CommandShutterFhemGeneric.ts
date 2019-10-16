import * as fetch from 'node-fetch';
import * as btoa from 'btoa';
import { CommandFhem } from "./protected/CommandFhem";

export class CommandShutterFhemGeneric extends CommandFhem {
    public async runCommand() {
        try {
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

            await this.requestFHEM(command);
            return true;
        } catch (err) {
            console.error(this.getModuleName() + ': ' + err);
        }
        return false;
    }
}