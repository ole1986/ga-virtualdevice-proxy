# Google Assistant Virtual Device Proxy

Google Assistant Virtual Device Proxy wird verwendet um die eingehenden Sprachbefehle von bestimmten Smart Home apps im lokalen Netzwerk zu verarbeiten und an verschiedene Endpunkte zu übermitteln (z.B. FHEM, Homematic, individuelle Skripte).

Dabei verfolgt dieses Projekt die Aufgabe als vollwertiger Vermittler zu agieren. **Die Kommunikation mit dem Endpunkt (FHEM, HomeMatic, o.ä.) findet daher ausschließlich über das Google Assistant Virtual Device Proxy statt.**

Somit sind keine weiteren Abhängigkeiten erforderlich. Weitere informationen in dem Abschnitt [Unterstützte Schnittstellen](#unterstützte-schnittstellen)

## Installation

### Proxy

Für die Installation wird [node.js](https://nodejs.org/en/) mit [npm](https://npmjs.org/) benötigt.
In der aktuellen Debian Distribution können diese Pakete wie folgt eingespielt werden.

```bash
# nodejs installieren
sudo apt-get install nodejs
# npm packet manager
curl -L https://npmjs.org/install.sh | sudo sh
```

Anschließend werden alle erforderlichen node module mit `npm install` in dem Projektverzeichnis installiert.

### Smart Home App

Über Google Assistant (z.B. mit dem Smartphone) kann in dem Abschnitt "Assistant" -> "Smart-Home-Steuerung" das Gerät "GA Virtuelle Geräte" hinzugefügt werden.

## Konfiguration

Die Konfiguration virtueller Geräte erfolgt hier: https://bit.ly/2OrCm1Q<br />
Bitte folge den Instruktionen der Seite um die erforderliche `config.json` für das Proxy zu erstellen

## Proxy starten

Um eingehende Sprachbefehle von Google Assistant zu empfangen muss das Proxy gestartet werden.

```bash
# run the proxy
npm start
```

## Unterstützte Schnittstellen

### FHEM

* [ShutterFhemGeneric](lib/CommandShutterGeneric.ts) - Generic ROLLO device type in FHEM
* [ShutterFhemBecker](lib/CommandShutterFhemBecker.ts) - Becker Centronic shutter for FHEM (requires [centronic-py](https://github.com/ole1986/centronic-py))
* [SwitchFhemGeneric](lib/CommandSwitchFhemGeneric.ts) - Generic control on switches in FHEM
* [LightFhemGeneric](lib/CommandLightFhemGeneric.ts) - Generic control on lights in FHEM

### Andere Skripte

* [ShutterBecker](lib/CommandShutterBecker.ts) - Becker Centronic native shell script ([centronic-py](https://github.com/ole1986/centronic-py))
