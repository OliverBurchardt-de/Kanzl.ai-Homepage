# Kanzl.ai — Website

> **KI, die in Ihrer Kanzlei ankommt.**
> Statische Marketing-Website für Kanzl.ai — KI-Enablement für Rechts- und Steuerkanzleien
> (Beratung, Video-Kurse, Workshops, Keynotes).

Gebaut nach den Standards des Skills **„website-entwicklung"** (Burchardt & Kollegen):
Barrierefreiheit (WCAG 2.1 AA), DSGVO, Core Web Vitals, SEO/AI-Auffindbarkeit.

---

## Schnellstart

```bash
npm install        # nur nötig, um Fonts neu zu ziehen (Fonts sind bereits eingecheckt)
npm start          # lokale Vorschau auf http://localhost:4173
```

Die Seite ist **reines statisches HTML/CSS/JS** – kein Build-Schritt nötig.
Zum Deployen einfach alle Dateien (außer `node_modules/`, `scripts/`) auf den
Webspace laden. Wurzelverzeichnis = Projektwurzel.

## Struktur

```
index.html              Startseite (alle Sektionen)
impressum.html          Impressum (Vorlage – Platzhalter ausfüllen)
datenschutz.html        Datenschutzerklärung (Vorlage)
barrierefreiheit.html   Erklärung zur Barrierefreiheit
robots.txt · sitemap.xml · llms.txt
assets/
  css/main.css          Design-System „Ink & Signal" (Tokens, Light/Dark, Komponenten)
  js/main.js            Theme-Toggle, mobile Nav, Prompt-Konsole, Scroll-Reveals
  fonts/                Selbstgehostete Variable-Fonts (WOFF2) + OFL-Lizenzen
  img/                  favicon.svg, og-image.svg
scripts/                serve.mjs (Vorschau), copy-fonts.mjs
```

## Design-System

- **Farben:** Ink (#090d17) als dramatischer Hintergrund, „Signal"-Cobalt (#1c3ef0)
  als Akzent. Vollständig über CSS-Variablen (`:root`) gesteuert – Markenfarben
  lassen sich in Minuten austauschen.
- **Typografie:** Fraunces (Display), Instrument Sans (Text), JetBrains Mono
  (Labels/„Aktenzeichen"). Alle **lokal gehostet** → kein Google-Fonts-CDN (DSGVO).
- **Signature:** die „Prompt-Konsole" im Hero, die echte Kanzlei-Anwendungsfälle
  vorführt. Respektiert `prefers-reduced-motion` (zeigt dann ein statisches Beispiel).

## Barrierefreiheit & Performance

- semantisches HTML, Skip-Link, sichtbarer Fokus, ARIA-Labels
- Light/Dark über `prefers-color-scheme` + manueller Toggle (persistiert)
- `prefers-reduced-motion` respektiert
- Fonts via `preload` + `font-display: swap`, JS `defer`, keine externen Requests
- Inline-SVG-Icons, keine Icon-Fonts, keine Framework-Runtime

## Noch auszufüllen (Platzhalter)

Vor dem Livegang bitte prüfen/ergänzen (im Code als `[…]` markiert):

- **Impressum:** Anschrift, Telefon, USt-IdNr., Kammer, Berufshaftpflicht
- **Datenschutz:** Hosting-Anbieter, Speicherfristen, ggf. Terminbuchungs-Tool
- **Kontakt:** Telefonnummer (`tel:`-Link in `index.html`), optional Calendly o. Ä.
- **Domain:** aktuell überall `https://kanzl.ai/` – bei anderer Domain ersetzen
- **Videos:** Platzhalter-Kacheln durch echte Clips ersetzen (mit Untertiteln)
- **OG-Image:** `assets/img/og-image.svg` ist Vektor; für maximale Kompatibilität
  optional zusätzlich als 1200×630-PNG exportieren.
