import * as config from './config.json';
import { AssistantProxyClient } from './lib/protected/AssistantProxyClient.js';
import { CommandFactory } from './lib/protected/CommandFactory';

if(!config) {
   console.error("No configuration found"); 
   process.exit(1);
}

if(!config.REMOTE_HOST) {
    console.error("No REMOTE_HOST defined");
    process.exit(1);
}

if(!config.USER_ID) {
    console.error("No USER_ID defined");
    process.exit(1);
}

let isPrimary = true;

var args = process.argv.slice(2);
if (args.length > 0) {
    isPrimary = false;
    // individually load necessary modules
    CommandFactory.loadModule('ReportFhem');
}
new AssistantProxyClient(isPrimary);
