import { CommandBase } from "./protected/CommandBase";
import { execSync } from "child_process";
import { existsSync } from "fs";

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

export class ShutterBecker extends CommandBase {
    public async runCommand() {
        try {
            let moduleConfig = this.getModuleConfig();
            let params = this.getParameters();
            let modes = this.getModes();
            let devices = this.getDevices();

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

            if(modes.all) {
                let result = execSync(moduleConfig.CENTRONIC_PATH + ' --send ' + direction + ' --channel 15');
                console.log(result.toString());
            } else {
                for(var i in devices) {
                    let item = devices[i];
                    let result = execSync(moduleConfig.CENTRONIC_PATH + ' --send ' + direction + ' --channel ' + item.channel);
                    console.log(result.toString());
                    // wait a second until the next radio signal is submitted
                    await sleep(1000);
                }
            }

            return true;
        } catch(err) {
            console.error(this.constructor.name + ': ' + err);
        }
        return false;
    }

    public validateConfig(conf) {
        if(!conf) {
            console.error('Missing configuration in config.json for ' + this.constructor.name);
            return false;
        }

        if(!conf.CENTRONIC_PATH) {
            console.error('Missing CENTRONIC_PATH in config.json for ' + this.constructor.name);
            return false;
        }

        if(!existsSync(conf.CENTRONIC_PATH)) {
            console.error('The path CENTRONIC_PATH defined in config.json could not be found for ' + this.constructor.name);
            return false;
        }

        return true;
    }
}