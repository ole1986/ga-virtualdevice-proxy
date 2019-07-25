# Google Assistant Virtual Device Proxy

Google Assistant Virtual Device Proxy wird verwendet um die eingehenden Sprachbefehle vom bestimmten Smart Home apps im lokalen Netzwerk zu verarbeiten und an verschiedene Endpunkte (z.B. FHEM) zu übermitteln.

Dabei verfolgt dieses Projekt die Aufgabe als vollwertiger Vermittler zu agieren. **Die Kommunikation mit dem Endpunkt (FHEM o.ä.) findet daher ausschließlich über das Google Assistant Virtual Device Proxy statt.**

Somit sind keine weiteren Abhängigkeiten erforderlich.

## Installation

Für die Installation vom Google Assistant Virtual Device Proxy wird [node.js](https://nodejs.org/en/) mit [npm](https://npmjs.org/) benötigt.
In der aktuellen Debian Distribution können diese Pakete wie folget installiert werden.

```
# nodejs installieren
sudo apt-get install nodejs
# npm paket manager installieren
curl -L https://npmjs.org/install.sh | sudo sh
```

Anschließend wird das Paket heruntergeladen und mit `npm install` alle erforderlichen Abhängigkeiten installiert.

## Einrichtung

Die Einrichtungsseite befindet sich hier: https://bit.ly/2YkfMfk<br />
Bitte folge den Instruktionen der Seite um die erforderliche `config.json` zu erstellen

## Unterstützte Geräte (Module)

Derzeit werden nachfolgende Geräte unterstützt un können über die Einrichtungsseite verwaltet werden

**Rollos**

* [ShutterFhemGeneric] - Generelle ROLLO Gerätetypen in FHEM
* [ShutterFhemBecker](lib/CommandShutterFhemBecker.ts) - Becker Centronic (über FHEM)
* [ShutterBecker](lib/CommandShutterBecker.ts) - Becker Centronic (native Kommandozeile)

**Lichter** (ausstehend)
