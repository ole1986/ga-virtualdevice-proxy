# Google Assistant Virtual Device Proxy

Google Assistant Virtual Device Proxy wird verwendet um die eingehenden Sprachbefehle von bestimmten Smart Home apps im lokalen Netzwerk zu verarbeiten und an verschiedene Endpunkte zu übermitteln (z.B. FHEM, Homematic, individuelle Skripte).

Dabei verfolgt dieses Projekt die Aufgabe als vollwertiger Vermittler zu agieren. **Die Kommunikation mit dem Endpunkt (FHEM, HomeMatic, o.ä.) findet daher ausschließlich über das Google Assistant Virtual Device Proxy statt.**

Somit sind keine weiteren Abhängigkeiten erforderlich.

## Installation

### Proxy

Für die Installation vom Google Assistant Virtual Device Proxy wird [node.js](https://nodejs.org/en/) mit [npm](https://npmjs.org/) benötigt.
In der aktuellen Debian Distribution können diese Pakete wie folget installiert werden.

```bash
# nodejs installieren
sudo apt-get install nodejs
# npm paket manager installieren
curl -L https://npmjs.org/install.sh | sudo sh
```

Anschließend wird das Paket heruntergeladen und mit `npm install` alle erforderlichen Abhängigkeiten installiert.

### Smart Home App

Über Google Assistant (z.B. mit dem Smartphone) kann in dem Abschnitt "Assistant" -> "Smart-Home-Steuerung" das Gerät "GA Virtual Device" hinzugefügt werden.

## Konfiguration

Die Konfiguration virtueller Geräte erfolgt hier: https://bit.ly/2OrCm1Q<br />
Bitte folge den Instruktionen der Seite um die erforderliche `config.json` für das Proxy zu erstellen

## Proxy starten

Um eingehende Sprachbefehle von Google Assistant zu empfangen muss das Proxy gestartet werden.

```bash
# starte das proxy
npm start
```

## Unterstützte Geräte (Module)

Derzeit werden nachfolgende Geräte unterstützt und können über die Einrichtungsseite verwaltet werden

**Rollos**

* [ShutterFhemGeneric](lib/CommandShutterGeneric.ts) - Generelle ROLLO Gerätetypen in FHEM
* [ShutterFhemBecker](lib/CommandShutterFhemBecker.ts) - Becker Centronic (über FHEM)
* [ShutterBecker](lib/CommandShutterBecker.ts) - Becker Centronic (native Kommandozeile)

**Schalter**

* [SwitchFhemGeneric](lib/CommandSwitchFhemGeneric.ts) - Generelles ansteuern von Schaltern in FHEM

**Lichter**

* [LightFhemGeneric](lib/CommandLightFhemGeneric.ts) - Generelles ansteuern von Lichtern in FHEM