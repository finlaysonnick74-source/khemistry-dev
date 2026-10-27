# Editing the Khemistry site

Three files hold everything you'd normally change:

| What | Where | Rebuild? |
|---|---|---|
| Colours | `css/site.css`, the `:root` block at the top | No, just reload |
| Words (all page copy, titles, meta descriptions, phone, email) | `content.py` | Yes: `python3 build.py` |
| Page layout / adding pages | `build.py` | Yes: `python3 build.py` |

## Change a colour
1. Open `css/site.css` and edit a hex value in the "core palette" part of `:root`, e.g. `--accent:#56715B;`.
2. If you change `--accent`, `--text` or `--bg-2`, update its `*-rgb` twin on the same block too (`--accent-rgb:86,113,91;`). Translucent shadows and lines use these.
3. Section backgrounds come from `--tone-tint` (heroes), `--tone-glass` (footer / "whole formula" band) and `--tone-cream` (body). `js/site.js` reads these variables to draw the scroll gradient, so there's no colour in the JS to change.
4. Keep text contrast at WCAG AA (4.5:1 for body text). `--accent` is only used for buttons, underlines and dots. Text uses `--text`, `--text-2` and `--accent-d`.

## Change wording
1. Open `content.py`, find the page dictionary (`FORMULA`, `PEOPLE`, `PLACE`, `PURPOSE`, `ABOUT`, `CONTACT`, `INSIGHTS`) or `SITE` for shared bits (phone, email, tagline, footer legal line).
2. Edit the text inside the quotes. Keep the key names as they are.
3. Run `python3 build.py` in this folder. It rewrites the 7 HTML pages.
Don't edit the `.html` files directly: the next build overwrites them.

## Add or rename a page
- Nav labels and order: `NAV` in `content.py`.
- New page: add a copy dictionary in `content.py`, then in `build.py` add `pages["new.html"]=(TITLE, DESC, f"""...sections...""")` using the existing sections as a pattern (each `<section class="sec" data-tone="tint|cream|glass">`). Add it to `NAV` if it should be in the menu.
- `data-draft="..."` attributes mark copy still awaiting client sign-off. Leave them in place until that copy is approved.

## Check
`python3 ../site-test.py` should print `ALL PASS`. To take review screenshots, run `python3 review/paletteB/shoot.py`.
