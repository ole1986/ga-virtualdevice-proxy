import { CommandFhem } from "./protected/CommandFhem";

export class CommandShutterFhemBecker extends CommandFhem {
    public async runCommand() {
        try {
            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            var fhem_prefix = settings.prefix;

            // build commands

            var direction = "HALT";

            if (params.openPercent == 0) {
                direction = "DOWN";
            } else if (params.openPercent == 100) {
                direction = "UP";
            } else if (params.openPercent <= 50) {
                direction = 'DOWN2';
            } else if (!params.start) {
                direction = 'HALT';
            }

            var cmdList = [];

            if (!modes.all) {
                devices.forEach(item => {
                    cmdList.push("set " + fhem_prefix + " number " + item.channel + "; set " + fhem_prefix + " " + direction);
                });
            } else {
                // broadcast channel
                cmdList.push("set " + fhem_prefix + " number 15; set " + fhem_prefix + " " + direction);
            }

            var command = cmdList.join(' ; ');

            await this.requestFHEM(command);
            return true;
        } catch (err) {
            console.error(this.getModuleName() + ': ' + err);
        }
        return false;
    }
}