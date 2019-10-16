import { CommandFhem } from "./protected/CommandFhem";

export class CommandSwitchFhemGeneric extends CommandFhem {
    public async runCommand() {
        try {
            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            // build commands
            var cmdList = [];

            var OnOff = params.start ? 'on': 'off';

            devices.forEach(item => {
                cmdList.push('set '+item.fhem_device +' ' + OnOff);
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