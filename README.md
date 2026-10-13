# 🎮 Spiele-Lounge

15 Spiele für den Spieleabend. Jeder spielt am eigenen Handy. Reines HTML, CSS und JavaScript, ohne Build-Schritt.

## Spiele

- **Zu zweit:** Tic Tac Toe, Vier gewinnt, Reversi, Dame, Schiffe versenken
- **Würfeln und Brettspiele:** Schwein, Kniffel, Mensch ärgere dich nicht, Monopoly, Nim
- **Karten und Denken:** Memory, UNO, Galgenmännchen
- **Für die ganze Runde:** Montagsmaler, Werwolf

## Spielmodi

- **Online mit Raum-Code:** Einer erstellt einen Raum, die anderen geben den 4-stelligen Code ein, scannen den QR-Code oder öffnen den Teilen-Link. Es gibt keinen Gastgeber: Jeder darf jederzeit gehen, der Raum bleibt bestehen.
- **Zusammen an einem Handy**
- **Gegen den Computer** mit drei Schwierigkeitsstufen (läuft auch ohne Internet, wenn die App installiert ist)

## Auf Render veröffentlichen

1. Alle Dateien aus diesem Ordner direkt in den Hauptordner eines GitHub-Repositorys legen (kein Unterordner).
2. Bei Render: **New + → Static Site**, Repository wählen.
3. **Build Command** leer lassen (oder `echo done`), **Publish Directory** auf `.` setzen.
4. **Create Static Site**. Nach etwa einer Minute ist die Seite unter einer `.onrender.com`-Adresse erreichbar.

Funktioniert genauso mit GitHub Pages oder Netlify.

## Auf dem Handy installieren

- **Android (Chrome):** Menü → „App installieren“ oder „Zum Startbildschirm hinzufügen“.
- **iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“.

## So funktioniert der Online-Modus

Alle Spielzüge laufen über öffentliche MQTT-Server (WebSocket, verschlüsselt). Die Seite probiert nacheinander:

1. `wss://broker.emqx.io:8084/mqtt`
2. `wss://broker.hivemq.com:8884/mqtt`
3. `wss://test.mosquitto.org:8081`

Alle in einem Raum landen auf demselben Server, solange dieser erreichbar ist. Das ist wichtig: Ist der erste Server nur für einen Teil der Gruppe nicht erreichbar, können Spieler auf unterschiedlichen Servern landen und sich nicht sehen. Dann hilft es, die Seite neu zu laden.

Eigenen Server nutzen: Hänge `?broker=wss://dein-server:port/mqtt` an die Adresse (der Server muss MQTT über WebSocket anbieten, zum Beispiel ein kostenloser HiveMQ- oder EMQX-Cloud-Zugang).

Hinweise:
- Die öffentlichen Server sind kostenlos, aber ohne Garantie. Die Räume sind nicht geheim: Wer Code und Adresse kennt, kann mitspielen. Spielt nicht um etwas Wichtiges.
- Wer zwischendurch das Handy sperrt oder das Netz verliert, verbindet sich automatisch neu und holt den Spielstand von den anderen.
- Die Bibliotheken (`mqtt.js`, `qrcode-generator`) werden von `cdn.jsdelivr.net` geladen. Ohne Internet funktionieren nur „Gegen den Computer“ und „Zusammen an einem Handy“.

## Technik

- `index.html`: die komplette App
- `manifest.webmanifest`, `sw.js`, `icon-*.png`: Installation auf dem Startbildschirm. Der Service Worker lädt immer die neueste Version und nutzt den Zwischenspeicher nur ohne Internet.
- Schriften (Fredoka, Nunito) von Google Fonts mit Fallback auf Systemschriften
- Statistik und Einstellungen liegen im `localStorage` des Browsers
