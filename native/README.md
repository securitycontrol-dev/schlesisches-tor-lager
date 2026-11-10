# Schlesisches Tor Lager – Xcode Schnellstart

**Stand:** iOS/iPadOS-Projekt wird mit Capacitor lokal erzeugt. Die bestehende PWA und ihre GitHub-Pages-Dateien bleiben erhalten. Der native Scanner wird aus dem npm-Paket lokal eingebunden, sodass die Scannerbibliothek auch ohne Internet geladen wird.

## Voraussetzungen auf dem Mac

- macOS mit zu Xcode passender Version, Xcode und Xcode Command Line Tools
- Node.js 20.11 oder neuer, npm
- CocoaPods, falls Capacitor/Xcode es anfordert; bei Fehlermeldung `pod --version` prüfen
- Für die Installation auf einem echten iPhone: Apple-ID/Signing Team in Xcode und am Mac angeschlossenes oder gekoppeltes Gerät

## Erstmalig starten

Im Terminal:

```bash
cd "/Users/roccogadenne/Desktop/APP/Schlesisches Tor/schlesisches-tor-lager"
git pull
cd native
npm install
npm test
npm run ios:setup
npm run ios:open
```

`ios:setup` kopiert die aktuelle Oberfläche, integriert die ZXing-Scannerbibliothek, erstellt das iOS-Projekt bei Bedarf, synchronisiert Capacitor und ergänzt `NSCameraUsageDescription` in `Info.plist`.

Falls `npm run ios:setup` mit CocoaPods-Fehler abbricht, erst `pod --version` prüfen und CocoaPods auf dem Mac installieren oder reparieren. **Nicht** die bestehenden Lagerdaten oder das GitHub-Repository löschen.

## Xcode

1. Das geöffnete Projekt `native/ios/App/App.xcworkspace` auswählen (nicht nur die .xcodeproj-Datei).
2. Unter **App → Signing & Capabilities** das eigene Apple-Team wählen und **Automatically manage signing** aktivieren.
3. Die Bundle-ID `de.schlesischestor.lager` auf Eindeutigkeit prüfen; falls Apple sie bereits belegt hat, in Xcode eine eigene ID setzen.
4. Unter **Devices** das iPhone oder iPad wählen; auf dem Gerät ggf. den Entwicklermodus einschalten.
5. Mit **Run ▶** die App bauen und installieren. Kamera-Berechtigung beim ersten Scannen erlauben.

Bei weiteren Änderungen an der Weboberfläche:

```bash
git pull
cd native
npm install
npm test
npm run ios:sync
npm run ios:open
```

## Datenübernahme und Sicherheit

**Wichtig:** Die Safari-/PWA-IndexedDB und die native Capacitor-IndexedDB sind getrennt. Die vorhandenen Daten werden **nicht automatisch** in die installierte App übernommen.

1. In der bisherigen Safari-PWA unter **Sicherung** ein JSON-Backup exportieren und an einem sicheren Ort speichern.
2. Die native App installieren, zunächst ohne produktive Buchungen.
3. In der nativen App unter **Mehr → Sicherung** das Backup importieren und Bestände/Artikel/Buchungen kontrollieren.
4. Die ursprüngliche PWA und ihr Backup behalten, bis die Übernahme geprüft wurde.

Die aktuelle App speichert **lokal auf dem jeweiligen Gerät**. Es gibt noch keine funktionsfähige CloudKit-Synchronisierung, keine automatischen verschlüsselten iCloud-Drive-Backups und keine Konfliktauflösung. Zwei Geräte deshalb noch **nicht parallel produktiv** nutzen.

## Testplan vor echtem Betrieb

- App öffnen, schließen und neu öffnen; gespeicherte Artikel bleiben erhalten
- Artikel anlegen und EAN scannen; Kamera-Berechtigung prüfen
- Offline: Artikel und Buchungen ohne Internet durchführen
- Hauptlager → Bar umbuchen und MHD/Chargen erhalten
- Inventur und Dauerscanner ausprobieren
- Eine Testveranstaltung anlegen und abschließen, PDF-Bericht prüfen
- JSON-Backup exportieren, in einer Testinstallation wiederherstellen und Zahlen vergleichen
- iPhone und iPad getrennt testen

**Noch nicht auf einem echten Gerät getestet.** Die iOS-Projektdateien werden beim Setup auf dem Mac erzeugt; Xcode-Signing und native Builds können erst dort validiert werden.

## Startabsturz mit iOS-27-SDK (UIScene)

Wenn Xcode beim Start `UIScene life cycle is required` meldet, enthält das Repository seit dem Fix eine automatische Migration. Sie ergänzt beim nächsten `npm run ios:sync` die Scene-Konfiguration in `Info.plist` und eine kleine `SceneDelegate`-Klasse in der bereits eingebundenen `AppDelegate.swift`. Die bestehende Capacitor-Storyboard-Oberfläche bleibt erhalten.

Im Terminal (vom Repository-Hauptordner aus):

```bash
git pull
cd native
npm run ios:sync
npm run ios:open
```

In Xcode **Product → Clean Build Folder** und anschließend das angeschlossene iPhone auswählen und **Run** starten. Die App **nicht deinstallieren**, damit lokale Daten erhalten bleiben. Bei einem erneuten Startabsturz bitte die neue Debug-Konsole prüfen. Dieser Fix wurde im Repository erstellt, aber noch nicht auf einem iPhone verifiziert.
