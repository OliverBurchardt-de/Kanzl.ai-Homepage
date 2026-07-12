# Video-Skript: „Werkstattbericht" (Testimonial)

**Zweck:** Beweis-/Vertrauensvideo für den Selbstversuch-Block (§ 10) der Startseite.
**Sprecher:** Oliver Burchardt (Steuerberater & Wirtschaftsprüfer), Ich-Form.
**Länge:** ca. 2:00–2:30 Min.
**Tonalität:** ruhig, ehrlich, kein Werbe-Duktus. Roh schlägt Hochglanz.

> Status: **Entwurf** – finalisieren nach dem Homepage-Review (siehe „Offene Entscheidungen" unten).
> `[…]` = von Oliver zu ergänzen.

---

## Skript

**0:00 – Hook (Oliver, in die Kamera)**
„Ich bin Oliver Burchardt, Steuerberater und Wirtschaftsprüfer. Vor [Zeitraum] habe ich
angefangen, meine eigene Kanzlei konsequent auf KI umzustellen. Was dabei herauskam,
hat mich selbst überrascht."

**0:12 – Ausgangslage**
„Wie viele Kanzleien hatten wir für alles eine eigene Software oder einen Dienstleister —
Strategie, Marketing, Reporting, eine Mandanten-App. Jedes für sich sinnvoll. In Summe:
teuer — und trotzdem viel Handarbeit."

**0:35 – Was wir gemacht haben** *(B-Roll: Bildschirmaufnahme, anonymisierte Muster)*
„Nach und nach haben wir diese Bausteine mit KI selbst abgebildet. Kein großes
IT-Projekt — Schritt für Schritt, mit Standard-Werkzeugen und etwas Mut. Heute laufen bei
uns Dinge über eigene, KI-gestützte Abläufe, für die wir vorher externe Tools bezahlt haben."

**1:10 – Ergebnis, ehrlich**
„Unterm Strich sparen wir eine fünfstellige Summe an Fixkosten — pro Jahr. Wie viel genau,
hängt von der Kanzleigröße ab. Und ja: Die Kosten für die KI-Werkzeuge rechne ich ehrlich
dagegen. Es bleibt trotzdem viel übrig."

**1:35 – Der wichtigste Effekt** *(ruhig, sorgfältig)*
„Der größte Effekt steht aber in keiner Rechnung: Wir wachsen, ohne im gleichen Tempo neues
Personal aufbauen zu müssen. Die Routine — Beleg für Beleg — nimmt ab. Dafür hat mein Team
Zeit für die Arbeit, die wirklich Wert schafft. Das ist kein Stellenabbau. Es macht die
Arbeit besser und die Köpfe frei."

**2:05 – Lehre + CTA (Oliver, in die Kamera)**
„Sie müssen nicht so weit gehen wie wir. Aber Sie sollten anfangen. Genau dieses
Praxiswissen — was sich lohnt, was nicht, und wie man es datenschutzkonform macht — geben
wir mit Kanzl.ai weiter. Wenn Sie mögen: Lassen Sie uns 15 Minuten reden."

---

## Dreh- & Rechts-Hinweise
- **Nie echte Mandantendaten** im Bild — nur anonymisierte Muster; im Video kurz erwähnen.
- **Untertitel** einblenden (Barrierefreiheit + viele schauen stumm) → als `.vtt`-Track einbinden.
- **10 Sek. Gesicht** am Anfang/Ende reichen für Vertrauen. Standbild daraus löst zugleich
  den „Foto folgt"-Platzhalter in der Personen-Sektion (§ 09).
- **WP-Werberecht (§ 52 WPO):** reiner Ich-Erfahrungsbericht, keine Erfolgsgarantie für
  Dritte — bitte trotzdem selbst gegenprüfen.

## Einbindung auf der Seite (bereits vorbereitet)
- **Ort:** Selbstversuch-Block (§ 10), rechte Spalte. Platzhalter-DIV `video-thumb.proof-video`.
- **Technik (DSGVO):** selbst gehostet, keine Dritt-Requests. In `index.html` liegt der
  einbaufertige Code als Kommentar:
  ```html
  <video class="proof-video" controls preload="none" poster="/assets/img/werkstattbericht-poster.jpg" style="display:block">
    <source src="/assets/video/werkstattbericht.webm" type="video/webm" />
    <source src="/assets/video/werkstattbericht.mp4" type="video/mp4" />
    <track kind="captions" src="/assets/video/werkstattbericht.de.vtt" srclang="de" label="Deutsch" default />
  </video>
  ```
  Dateien nach `assets/video/` bzw. `assets/img/` legen, Platzhalter ersetzen — fertig.

## Offene Entscheidungen (Homepage-Review)
1. „fünfstellige Summe" so lassen — oder ganz ohne Zahl-Andeutung?
2. Personal-Satz („wachsen ohne Personalaufbau … kein Stellenabbau") — Ton ok?
3. Stimmen die fünf abgelösten Kategorien (Strategie-/Kanzlei-Software · Marketing/Ads ·
   Fachsystem-Anbindung · Reporting/BWA · Mandanten-App)?
4. Skript-Tonalität ok? Zeiträume/Details ([…]) ergänzen.
