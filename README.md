# Google Assistant Virtual Device Proxy

[German](README.de.md)

Google Assistant Virtual Device Proxy is used to receive incomming voice commands from a Smart Home app and process the result (while being in the local network) for different endpoints (like. FHEM, Homematic, individual scripts).

The primary goal of this project is to act as an agent (or middleware) by passing the commands (through a compatible interface) directly to the applications endpoint.

So there are no other dependencies required. Check out the [Supported interfaces](#supported-interfaces) chapter fpr more details

## Installation

### Proxy

for the installation you need [node.js](https://nodejs.org/en/) and [npm](https://npmjs.org/).
On the latest debian linux you can achieve this by doing.

```bash
# install nodejs
sudo apt-get install nodejs
# npm packet manager
curl -L https://npmjs.org/install.sh | sudo sh
```

Followed by `npm install` to install all necessary node modules.

### Smart Home App

Find the "GA Virtual Device" smart home app in your Google Assistant compatible device (smartphone) and add it.

## Configuration

Check out https://bit.ly/2OrCm1Q to configure your virtual devices.
Please follow the instructions from the page to also setup the `config.json` required for the Proxy

## Run the Proxy

To let the proxy receive incomming voice commands it is neccary to execute the following from its project directory

```bash
# run the proxy
npm start
```

## Supported Interfaces

### FHEM

* [ShutterFhemGeneric](lib/CommandShutterGeneric.ts) - Generic ROLLO device type in FHEM
* [ShutterFhemBecker](lib/CommandShutterFhemBecker.ts) - Becker Centronic shutter for FHEM (requires [centronic-py](https://github.com/ole1986/centronic-py))
* [SwitchFhemGeneric](lib/CommandSwitchFhemGeneric.ts) - Generic control on switches in FHEM
* [LightFhemGeneric](lib/CommandLightFhemGeneric.ts) - Generic control on lights in FHEM

### Other Scripts

* [ShutterBecker](lib/CommandShutterBecker.ts) - Becker Centronic native shell script ([centronic-py](https://github.com/ole1986/centronic-py))
