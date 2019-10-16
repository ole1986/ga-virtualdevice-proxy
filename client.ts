import * as config from './config.json';
import { AssistantProxyClient } from './lib/protected/AssistantProxyClient.js';

import 'log-timestamp';

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

new AssistantProxyClient();