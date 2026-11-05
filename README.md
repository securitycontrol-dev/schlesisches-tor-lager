# Schlesisches Tor – Offline-Lagerverwaltung

Eigenständige PWA für **ein Hauptgerät (iPhone)**. Keine Datenbank auf GitHub; die Bestandsdaten liegen lokal im Browser (IndexedDB).

## GitHub Pages veröffentlichen – getrennt von anderen Projekten

1. In GitHub ein **neues, separates Repository** namens `schlesisches-tor-lager` anlegen. Für GitHub Pages im Free-Tarif **Public** auswählen. Kein bestehendes Projekt überschreiben.
2. Repository öffnen → **Add file → Upload files** und **alle Dateien aus diesem Ordner** hochladen (nicht nur die ZIP-Datei). Auf dem iPhone die ZIP-Datei in der Dateien-App vorher entpacken. Dateien müssen im **Stammverzeichnis** liegen.
3. Änderungen committen.
4. **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**.
5. Nach der Bereitstellung öffnen: `https://DEIN-BENUTZERNAME.github.io/schlesisches-tor-lager/`.
6. Safari → Teilen → **Zum Home-Bildschirm**. Offline-Start im Flugmodus testen.

### Achtung
- GitHub Pages veröffentlicht **Programmdateien öffentlich**. Keine echten Lagerdaten, Sicherungsdateien oder Passwörter hochladen.
- Die Daten bleiben **nur auf dem jeweiligen Gerät**. Keine automatische Synchronisierung mit dem iPad.
- Regelmäßig in der App JSON-Backups erstellen und außerhalb der App sichern.
- Kamera-Barcodeerkennung funktioniert nur in Browsern mit `BarcodeDetector`; manuelle Eingabe bleibt möglich.
- Diese Version ist ein **Prototyp**, noch nicht auf einem echten iPhone vollständig getestet.
- Das Veröffentlichen einer neuen App-Version darf die lokalen Bestände nicht löschen, solange dieselbe Website-Adresse genutzt und Website-Daten nicht gelöscht werden. Trotzdem vorher ein Backup machen.
