# Ravenguard — Guild Site

A small one-page site for the Ravenguard guild (Tarren Mill, EU).

## Structure
```
.
├── index.html              # the page (markup only)
├── css/
│   └── style.css           # all styling
├── js/
│   └── script.js           # raid bars, past-tiers panel, image zoom
└── images/
    ├── logo/               # guild crest + favicon
    ├── games/              # game card art (wow, poe2, sot)
    └── screenshots/        # AOTC kill shots
```

## Deploy (GitHub Pages)
1. Put these files in the root of your repo.
2. Settings → Pages → Source: "Deploy from a branch" → main / root.
3. Live at https://<user>.github.io/<repo>/ within a minute or two.

## Updating raid progress
Open `js/script.js` and edit the `midnight` array near the top.
Set each boss's `cleared` to `"heroic"`, `"normal"`, or `"none"`.
The X/Y count, the bar fill, and the colour update automatically.
(e.g. when Sporefall's Rotmire dies, change its `cleared` to `"heroic"`.)

### Automatic tracking (Raider.IO)
The site also pulls live progress from the Raider.IO API on page load
(`fetchRio` in `js/script.js`). When RIO has data for a raid, it **overrides**
the manual count/bar/difficulty for that raid; otherwise the manual list is used
as a fallback. This means once you're raiding a live tier, progress updates on
its own (RIO refreshes within ~a day of a kill) with no code edits.

Matching works via each raid's `rioKey` — the Raider.IO raid slug. To find the
real slugs, open the API URL in a browser and read the keys under
`raid_progression`:
`https://raider.io/api/v1/guilds/profile?region=eu&realm=tarren-mill&name=Ravenguard&fields=raid_progression`

Verified against the live API (2026-07-01), RIO exposes `tier-mn-1` (the whole
first tier — Voidspire + Dreamrift + March on Quel'Danas aggregated as 9 bosses),
`sporefall`, and `the-venomous-abyss`. Because RIO merges the first three raids
into one key, they can't be tracked individually and stay manual; only `sporefall`
carries a `rioKey`.

Note: RIO only reports **aggregate** counts per raid (e.g. 6/8 Heroic), not
which specific boss died — so the per-boss names always come from the manual
`bosses` list.

## Adding a past-tier kill shot
In `js/script.js`, give the tier an `img:` path, e.g.
`{ id:"sl1", ..., img:"images/screenshots/your-shot.jpg" }`.
Drop the image in `images/screenshots/` and it becomes zoomable too.
