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

## Adding a past-tier kill shot
In `js/script.js`, give the tier an `img:` path, e.g.
`{ id:"sl1", ..., img:"images/screenshots/your-shot.jpg" }`.
Drop the image in `images/screenshots/` and it becomes zoomable too.
