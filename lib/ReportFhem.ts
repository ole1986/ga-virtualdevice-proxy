import { CommandFhem } from "./protected/CommandFhem";
import { ICommandSync } from "./protected/CommandBase";
import { CommandFactory } from "./protected/CommandFactory";

export class ReportFhem extends CommandFhem implements ICommandSync {
    public async onDevicesSynced(): Promise<void> {
        var args = process.argv.slice(2);

        if (args.length === 0) {
            console.warn("No arguments given for ReportFhem in ga-virtualdevice-proxy");
            return;
        }

        // find the device given in argument two
        let matchDevices = this.getSyncedDevices().filter(x => x.fhem_device === args[0]);
        // request FHEM to check the state
        let parsedReadings = await this.queryStatusForDevices(matchDevices, { online: true });
        // send the report and close the connection
        CommandFactory.Proxy.SendReport(parsedReadings);
        CommandFactory.Proxy.close();
    }
}