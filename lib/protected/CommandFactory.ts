import * as config from '../../config.json';
import { CommandBaseInterface } from './CommandAbstract';
import * as store from '../store';
import { AssistantProxyClient } from './AssistantProxyClient.js';

export class CommandFactory {
    static _allowedModules: Array<string> = config.ALLOWED_MODULES;
    static Proxy: AssistantProxyClient;

    public static resolveModule(msg: string): CommandBaseInterface {
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

        if (this._allowedModules.indexOf(fullModuleName) === -1) {
            console.error("Unsupported device module " + fullModuleName);
            return;
        }

        var moduleClassDefinition = 'Command' + fullModuleName;
        return new store[moduleClassDefinition](moduleName, deviceType, data);
    }
}