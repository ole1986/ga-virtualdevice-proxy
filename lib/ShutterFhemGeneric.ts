import { CommandFhem } from "./protected/CommandFhem";

export class ShutterFhemGeneric extends CommandFhem {
    public async runCommand() {
        try {
            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            // build commands
            var cmdList = [];

            var direction = "HALT"

            if (params.openPercent == 0) {
                direction = "down"
            } else if (params.openPercent == 100) {
                direction = "up"
            } else if (!params.start) {
                direction = "stop"
            }

            if (!modes.all) {
                devices.forEach(item => {
                    cmdList.push('set '+ item.fhem_device + ' ' + direction);
                });
            } else {
                // broadcast channel
                cmdList.push("set " + settings.all_shutters + ' ' + direction);
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