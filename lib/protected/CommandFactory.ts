import * as config from '../../config.json';
import { ICommandBase, ICommandSync } from './CommandBase';
import * as store from '../store';
import { AssistantProxyClient } from './AssistantProxyClient.js';

export class CommandFactory {
    static _loadedModules: Map<string, ICommandBase> = new Map<string, ICommandBase>();
    static Proxy: AssistantProxyClient;
    static _devices: any[];

    public static loadModules() {
        config.MODULES.forEach(x => {
            CommandFactory.loadModule(x);
        })
    }

    public static syncDevices(msg: string) {
        this._devices = JSON.parse(msg);

        CommandFactory._loadedModules.forEach(x => {
            if ("onDevicesSynced" in x) {
                (x as ICommandSync).onDevicesSynced();
            }
        });
    }

    public static loadModule(moduleName: string): ICommandBase {
        if(!store[moduleName]) {
            console.error("Module '" + moduleName + "' is unavailable.");
            return;
        }

        const moduleObject = new store[moduleName](moduleName);
        this._loadedModules.set(moduleName, moduleObject);

        return moduleObject;
    }

    public static resolveModule(msg: string): ICommandBase {
        var data = JSON.parse(msg);

        if (!data) return;
        if (!data.hasOwnProperty("settings")) return;
        if (!data.hasOwnProperty("devices")) return;

        var deviceType = data!.deviceType;
        var moduleName = data!.settings!.module;

        if(!deviceType) {
            console.error("Unknown device type");
            return;
        }

        if(!moduleName) {
            console.error("Unknown device module");
            return;
        }

        var fullModuleName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1) + moduleName;

        if (!store[fullModuleName]) {
            console.error("Module '" + fullModuleName + "' is unregistered.");
            return;
        }

        if (!CommandFactory._loadedModules.has(fullModuleName)) {
            console.error("Module '" + fullModuleName + "' is uninitialized.");
            return;
        }

        let moduleObject = CommandFactory._loadedModules.get(fullModuleName);

        moduleObject.setData(data);

        return moduleObject;
    }
}