import * as config from '../../config.json';

export interface CommandBaseInterface {
    getModes(): any;
    getParameters(): any;
    getSettings(): any;
    getDevices(): any;
    runCommand(): Promise<boolean>;
    getFHEMConfig(): any;
    getModuleConfig(): any;
    getModuleName(): string;
    getDeviceType(): string;
    validateConfig(conf: any);
}

export class CommandBase implements CommandBaseInterface {
    private _data: any;
    private _moduleName: string;
    private _deviceType: string;

    constructor(moduleName: string, deviceType: string, data: any) {
        this._data = data;
        this._moduleName = moduleName;
        this._deviceType = deviceType;
    }

    public getModuleName() {
        return this._deviceType.charAt(0).toUpperCase() + this._deviceType.slice(1) + this._moduleName;
    }

    public getDeviceType() {
        return this._deviceType
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

    public async runCommand(): Promise<boolean> {
        console.log("You are running from the abstraction class");
        return false;
    }
}