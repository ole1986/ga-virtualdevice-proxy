import { CommandBase } from "./protected/CommandAbstract";
import { execSync } from "child_process";

export class CommandSwitchScript extends CommandBase {
    public async runCommand() {
        try {
            let config = this.getModuleConfig();

            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();
            let settings = this.getSettings();

            let args = Object.keys(params).map(x => '--' + x + ' "' + params[x] + '"');

            devices.forEach(item => {
                args.push('--alias "' + item.alias + '"');
                let cmdlet = config.command + ' ' + args.join(' ')
                console.log('### Running ' + cmdlet);
                execSync(cmdlet);;
            });

            return true;
        } catch (err) {
            console.error(this.getModuleName() + ': ' + err);
        }
        return false;
    }

    public validateConfig(conf): boolean {
        if (!conf)
            return false;

        if(!conf.command) {
            console.error("no command defined in configuration for " + this.getModuleName());
            return false;
        }

        return true;
    }
}