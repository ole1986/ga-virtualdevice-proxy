import * as config from '../../config.json';
import { CommandFactory } from './CommandFactory.js';

export interface ICommandData {
    params: any;
    modes: any;
    settings: any;
    devices: any[];
}

export interface ICommandSync {
    onDevicesSynced(): Promise<void>;
}

export interface ICommandBase {
    getModes(): any;
    getParameters(): any;
    getSettings(): any;
    getDevices(): any;
    getSyncedDevices(): any[];
    runCommand(): Promise<boolean>;
    queryStatus(): Promise<object>;
    sendStatus(): Promise<void>;
    getFHEMConfig(): any;
    validateConfig(conf: any);
    setData(data: ICommandData | any)
}

export class CommandBase implements ICommandBase {
    private _moduleName: string;
    private _data: ICommandData;
    protected _devices: any[];;

    constructor(moduleName: string) {
        this._moduleName = moduleName;
    }

    public getModuleName() {
        return this._moduleName;
    }

    public getModuleConfig() {
        let moduleConfigName = this.getModuleName();
        if(!this.validateConfig(config[moduleConfigName])) {
            throw 'Module configuration invalid for ' + moduleConfigName;
        }

        return config[moduleConfigName];
    }

    public getFHEMConfig() {
        var fhemConfig = config["fhem"];

        if(!fhemConfig.url) throw 'FHEM url missing in configuration';
        if(!fhemConfig.csrf) throw 'FHEM csrf missing in configuration';
        if(fhemConfig.username && !fhemConfig.password) throw 'FHEM password missing in configuration';

        return fhemConfig;
    }

    public validateConfig(conf): boolean {
        if (!conf)
            return false;
        return true;
    }

    public setData(data: ICommandData | any) {
        this._data = data;
    }

    public getParameters(): any {
        return this._data.params || {};
    }

    public getModes(): any {
        return this._data.modes || {};
    }

    public getSettings(): any {
        return this._data.settings ||{};
    }

    public getDevices(): Array<any> {
        return this._data.devices || [];
    }

    public getSyncedDevices() {
        return CommandFactory._devices;
    }

    public async runCommand(): Promise<boolean> {
        console.log("You are running from the abstraction class");
        return false;
    }

    public async queryStatus(): Promise<object> {
        return null;
    }

    public async sendStatus(): Promise<any> {
        let queryResult = await this.queryStatus();

        if(!queryResult) {
            console.warn("Querying status result into an empty value for " + this.getModuleName() + ". Make sure you have implemented the queryStatus() method");
            return;
        }

        CommandFactory.Proxy.SendStatus(queryResult);
    }
}