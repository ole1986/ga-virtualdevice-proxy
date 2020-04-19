import * as fetch from 'node-fetch';
import * as md5 from 'md5';
import * as btoa from 'btoa';
import * as config from '../../config.json';
import { CommandBase, ICommandSync } from './CommandBase.js';
import { CommandFactory } from './CommandFactory';

export class CommandFhem extends CommandBase implements ICommandSync {
    static hashDevices: string;

    public async onDevicesSynced(): Promise<void> {
        const devices = this.getSyncedDevices();

        // filter out only fhem related devices
        const fhemDevices = devices.filter(x => x.hasOwnProperty('fhem_device'));
        // prepare regulate expressed notifier for FHEM
        const regexDevices = "(" + fhemDevices.map(x => x.fhem_device).join('|') + ")";
        const hash = md5(regexDevices);

        if (hash === CommandFhem.hashDevices) {
            // ignore when its the same list
            return;
        }

        // update hash
        CommandFhem.hashDevices = hash;

        const clientPath = process.cwd() + '/client.js';

        const result = await this.requestFHEM('defmod GANotifier notify ' + regexDevices + ' "/usr/bin/node ' + clientPath + ' $NAME"');
        console.log("Updated FHEM notifier for GA Virtual Proxy", result);

        // fetch current STATE from FHEM devices
        let parsedReadings = await this.queryStatusForDevices(fhemDevices);
        // submit report state for devices
        CommandFactory.Proxy.SendReport(parsedReadings);
    }

    public getFHEMConfig() {
        var fhemConfig = config["fhem"];

        if(!fhemConfig.url) throw 'FHEM url missing in configuration';
        if(!fhemConfig.csrf) throw 'FHEM csrf missing in configuration';
        if(fhemConfig.username && !fhemConfig.password) throw 'FHEM password missing in configuration';

        return fhemConfig;
    }

    protected async requestFHEM(command: string): Promise<string> {
        var config = this.getFHEMConfig();

        let headers = {};
        if (config.username && config.password) {
            var b64code = btoa(config.username + ":" + config.password);
            headers['Authorization'] = 'Basic ' + b64code;
        }

        console.log("### Executing " + config.url + " with command '" + command + "'...");

        var urlWithParams = config.url + '?cmd=' + encodeURI(command) + '&XHR=1&fwcsrf=' + config.csrf;

        let result = await fetch(urlWithParams, { method: 'GET', headers: headers });
        return await result.text();
    }

    private parseReadings(readings: Array<string>): Array<object> {
        return readings.map(x => {
            if(x.indexOf('on') !== -1) {
                return { on: true };
            } else {
                return { on: false };
            }
        });
    }

    public async queryStatusForDevices(devices: any[], defaultStruct: object = {}) {
        const stateRequest = "{" + devices.map(x => {
            return 'InternalVal("'+ x.fhem_device + '", "STATE", "")';
        }).join('."|".') + "}";

        const stateResponse = await this.requestFHEM(stateRequest);
        const parsedReadings = this.parseReadings(stateResponse.split('|'));

        let result = {};

        devices.forEach((x, i) => {
            result[x.id] = Object.assign(parsedReadings[i], defaultStruct);
        });

        return result;
    }

    public async queryStatus(): Promise<object> {
        let devices = this.getDevices();
        return await this.queryStatusForDevices(devices, { online: true });
    }
}