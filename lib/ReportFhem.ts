import { CommandFhem } from "./protected/CommandFhem";
import { ICommandSync } from "./protected/CommandBase";
import { CommandFactory } from "./protected/CommandFactory";

import * as fs from 'fs';
import { exec } from 'child_process';

export class ReportFhem extends CommandFhem implements ICommandSync {
    private exchangeFilePath: string;
    private isSynced: boolean;

    constructor(moduleName: string) {
        super(moduleName);

        this.exchangeFilePath = process.cwd() + "/FHEMNOTIFIER";

        if (!fs.existsSync(this.exchangeFilePath)) {
            fs.writeFileSync(this.exchangeFilePath, "");
            exec("chmod 666 " + this.exchangeFilePath);
        }

        fs.watch(this.exchangeFilePath, "utf8", (event: string, filename: string) => this.onFileExchange(event, filename));
    }

    public async onDevicesSynced(): Promise<void> {
        const devices = this.getSyncedDevices();

        // filter out only fhem related devices
        const fhemDevices = devices.filter(x => x.hasOwnProperty('fhem_device'));
        // prepare regulate expressed notifier for FHEM
        const regexDevices = "(" + fhemDevices.map(x => x.fhem_device).join('|') + ")";

        const result = await this.requestFHEM('defmod GANotifier notify ' + regexDevices + ' { system("/bin/echo \'$NAME\' > ' + this.exchangeFilePath + '") }');
        console.log("Updated FHEM notifier for GA Virtual Proxy", result);

        let parsedReadings = await this.queryStatusForDevices(fhemDevices);
        // submit report state for devices
        CommandFactory.Proxy.SendReport(parsedReadings);

        this.isSynced = true;
    }

    private async onFileExchange(eventType, filename) {
        if (!filename) return;
        if (!this.isSynced) return;

        const deviceName = fs.readFileSync(this.exchangeFilePath, 'utf8').trim();

        // skip empty deviceNames
        if (!deviceName) return;

        // find the device given in argument two
        let matchDevices = this.getSyncedDevices().filter(x => x.fhem_device === deviceName);
        // request FHEM to check the state
        let parsedReadings = await this.queryStatusForDevices(matchDevices);
        // send the report and close the connection
        CommandFactory.Proxy.SendReport(parsedReadings);
    }
}