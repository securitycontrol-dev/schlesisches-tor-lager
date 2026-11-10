# Native iOS/iPadOS Vorbereitung

**Status:** Installierbares Capacitor-Projekt vorbereitet; CloudKit, iCloud-Drive-Backups und vollständige Konfliktauflösung sind **noch nicht implementiert**. Die bestehende GitHub-Pages-PWA bleibt unverändert.

## Nach dem macOS-Update

1. Repository lokal aktualisieren: `git pull`.
2. `cd native && npm install`.
3. `npm run prepare:web` (kopiert bestehende Weboberfläche nach `native/www`).
4. `npx cap add ios` (einmalig; benötigt Xcode und CocoaPods).
5. `npm run ios:sync && npm run ios:open`.
6. In Xcode Team, Bundle-ID und Signierung prüfen; auf iPhone und iPad installieren und lokale Datenmigration testen.

**Achtung:** Auf Geräten vorhandene Safari-/PWA-IndexedDB-Daten werden durch die native App nicht automatisch übernommen. Vor der Umstellung in der alten PWA ein manuelles Backup exportieren und die Wiederherstellung in einer Testinstallation prüfen. Originaldaten niemals ohne geprüftes Backup löschen.

## Geplante native CloudKit-Anbindung

- CloudKit Private Database im selben Apple-Account; Container-ID und iCloud-Capability in Xcode konfigurieren.
- Native Bridge zwischen JavaScript und CloudKit implementieren; keine CloudKit-Schlüssel in JavaScript einbetten.
- Unveränderliche Buchungsoperationen mit UUID, Geräte-ID, Zeitpunkt und Status. Bei Netzwerkfehlern lokal behalten, wiederholen, auf CloudKit-Record-ID deduplizieren.
- Artikel-Metadaten per Versionsprüfung aktualisieren; gleichzeitig geänderte Werte als Konflikt anzeigen. Inventuren und Veranstaltungsabschlüsse brauchen einen kontrollierten Abgleich und eine Sperr-/Konfliktstrategie; **keine** stillen Last-Write-Wins-Überschreibungen.
- CloudKit-Änderungen auf beiden Geräten nach App-Start und bei Push/Refresh nachladen. Offline-Buchungen müssen vor Freigabe in realistischen Konflikttests geprüft werden.

## Backup-Anforderung

- Tägliches, **verschlüsseltes** vollständiges Backup in iCloud Drive, wenn die App läuft; bei versäumter Sicherung beim nächsten Start nachholen.
- Automatische Sicherungen 30 Tage aufbewahren, manuelle nicht automatisch löschen.
- Verschlüsselung mit einem vom Nutzer sicher aufbewahrten Wiederherstellungsschlüssel; AES-GCM mit zufälligem Nonce je Sicherung, KDF und Formatversion. **Keine** unverschlüsselten temporären Exporte in iCloud Drive.
- Prüfsumme/Integritätsprüfung und Test-Wiederherstellung vor Freigabe. Vor Wiederherstellung aktuellen Stand sichern, Synchronisierung anhalten, Konflikte kontrolliert auflösen.
- iCloud Drive ist von CloudKit zu unterscheiden. Die Dateispeicherung erfordert eine eigene native iOS-Implementierung.

## Tests vor produktiver Nutzung

- Erstinstallation iPhone/iPad; Barcode-Scanner-Berechtigung; beide Geräte gleiche Apple-ID.
- Offline-Buchung auf beiden Geräten und späterer paralleler Sync; gleiche Buchung nicht doppelt.
- Gleichzeitige Inventur und Veranstaltungsabschluss; Konfliktlösung.
- App-Neustart, Gerätewechsel, Backup 30-Tage-Rotation, Schlüsselverlust-Szenario, Backup-Wiederherstellung.
- Altbestand aus PWA exportieren und vollständig gegen native Daten vergleichen.

## Aktueller Funktionsstand der Weboberfläche

Die Weboberfläche enthält jetzt zusätzlich **Erweiterte Auswertung** (Inventurdifferenzen, Veranstaltungsvergleich, Einkaufsliste, Entsorgung) und **Synchronisierung** (ehrlicher Hinweis: CloudKit noch nicht aktiv). Der vorhandene Dauerscan-Modus in der Sammelbuchung bleibt bestehen. Diese Änderungen sind zunächst JavaScript-syntaktisch geprüft, nicht auf iOS end-to-end getestet. Bei bestehender Installation vor dem ersten Update ein manuelles JSON-Backup erstellen. Keine neue Datenbankversion und keine automatische Löschung bestehender Datensätze.
