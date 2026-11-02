# CSTAR site

The public site for **CSTAR**, a Windows desktop suite for preliminary liquid
rocket engine design.

Static HTML, CSS and one small script. No build step, no framework, no
dependencies, no external requests — the folder is the site.

This repository is the published site. The application repository keeps a
working copy under `site/`; when editing there, treat that folder as the root
shown below.

## Preview

```bash
python -m http.server 8000
```

Open <http://localhost:8000>. Every page is plain HTML; the only runtime work is
`site.js` filling in the configured links and the reveal-on-scroll motion.

## Structure

```
.
├── index.html        landing page, app figures, pricing, FAQ
├── validation.html   full validation report, printable
├── activate.html     post-purchase page: collects the buyer's Hardware ID
├── 404.html          styled not-found page
├── style.css         the shared design system and every page rule
├── site.js           SITE_CONFIG, link wiring and entrance motion
├── CNAME             the custom domain — see the warning below
├── .nojekyll         tells Pages to publish the files as-is
├── robots.txt        keeps activate.html out of search results
├── sitemap.xml
└── assets/
    ├── flowfield.png
    ├── gasdynamics.png
    ├── thermal.png
    ├── structural.png
    ├── logo.png
    ├── test-stand-at-the-rocket-engine-test.jpg
    ├── credits.json
    └── fonts/
        └── Geist-Variable.woff2
```

`.nojekyll` switches off Jekyll, which GitHub Pages otherwise runs over the
repository. Nothing here needs it, and Jekyll silently skips files and folders
whose names begin with an underscore — a trap worth disarming before it costs
an afternoon.

**Do not delete `CNAME`.** GitHub Pages reads the custom domain from that file.
Setting the domain in the repository's Settings creates it on GitHub's side, but
a fresh checkout or a re-publish without the file loses it. Keeping it in the
repository means it travels with everything else.

## Design

One system across every page. The tokens live at the top of `style.css`:

| token | value | use |
|---|---|---|
| `--paper` | `#f2f3ef` | page ground |
| `--paper-2` | `#e7e9e3` | alternating bands, table heads |
| `--ink` | `#11181a` | body text, primary buttons |
| `--muted` | `#56615d` | secondary copy, captions |
| `--petrol` | `#0d6b62` | active state, small accents |
| `--dark` | `#0b1220` | solver plates, closing band |
| `--cyan` | `#00b4ff` | logo and chart highlights |
| `--amber` | `#f0b429` | warnings in figures |
| `--red` | `#e5566f` | negative values in figures |

The rules are deliberately narrow: square corners, 1px rules, tabular numerals,
no gradients, no glow, no decorative shadows. Geist is self-hosted from
`assets/fonts/`; the site itself makes no request to Google Fonts, an analytics
service or a CDN. Links to NOWPayments, GitHub and the contact address are
navigation, not loaded resources.

Every solver figure is real output from the shipped example engine, not a
mockup. `assets/credits.json` records the NASA photograph and its public-domain
status; the credit is printed on the landing page.

## Configuration

Edit `SITE_CONFIG` in `site.js`:

```js
window.SITE_CONFIG = {
  price:        '$149',
  priceNote:    'one-time',
  buyUrl:       'https://nowpayments.io/payment?iid=...',
  demoUrl:      'https://github.com/EndrickN/cstar-site/releases/latest/download/CSTAR_v1.0.exe',
  contactEmail: 'cstar.propulsion@gmail.com',
};
```

Every page loads the same file, so the price, checkout link, demo link and
contact address are changed once. Links also carry real fallback URLs in the
HTML; the script only overrides them when a config value is present.

Anything left empty leaves the hard-coded link in place rather than dead-ending
a visitor. You can publish before payments are wired and take enquiries by email
in the meantime.

Nothing secret belongs in this repository. It is public.

## Deploy

GitHub Pages serves this repository from `main` at the repository root, with the
custom domain in `CNAME`:

```bash
git push origin main
```

That is the whole deploy. Pages needs a **public** repository on the free plan.
Never publish the application repository; it contains the source, the licence
tooling and the private signing key path.

The application repository keeps an identical copy under `site/`. Edit either
copy, sync the other, and push this repository when the site is ready.

Any static host works as well: drag the folder onto **Cloudflare Pages**,
**Netlify** or **Vercel**. All three are free with a custom domain and HTTPS.

## The demo executable

Do **not** commit the binary. It is currently about **197 MB**, and Git keeps
every version forever; ten rebuilds would add roughly 2 GB to the history for no
benefit. Publish it as a **GitHub Release asset** instead: it stays out of the
repository, allows up to 2 GB, and gives you download counts, which is your
first real signal about the funnel.

```js
demoUrl: 'https://github.com/EndrickN/cstar-site/releases/latest/download/CSTAR_v1.0.exe'
```

`latest/download` is a permanent link — new releases do not need a site edit.

## Refreshing the solver figures

The four figures in `assets/` are generated from the application, not drawn by
hand. Run this in the application repository after any solver change:

```bash
python tools/build_site_assets.py
```

It writes the four PNGs, copies the logo, and prints the figures quoted in the
page copy. If any of those numbers move, update the matching values in
`index.html`.

## NOWPayments

**Create the account** at nowpayments.io and confirm your email.

**Add a payout wallet.** Nothing can be created until there is somewhere for the
money to go. While you are here, switch on **auto-conversion to a stablecoin**
(USDT/USDC). Without it, the amount you actually receive drifts with the market
between the sale and the moment you look at the balance — for a fixed-price
product that is pure downside.

**Create the payment link.** Set:

| field | value |
|---|---|
| Price currency | **USD** — let the buyer pay in whatever coin they like; you quote in dollars |
| Amount | 149 |
| Order description | `CSTAR v1.0 — STANDARD licence` |
| Success URL | `https://www.cstar.space/activate.html` |
| Cancel URL | `https://www.cstar.space/#pricing` |

**The success URL is the important one.** Licences are hardware-bound, so a key
cannot exist until the buyer has run the app once and read their Hardware ID.
`activate.html` walks them through exactly that. Point the success URL at a
generic "thank you" page instead and you will answer *"I paid, where is my
key?"* by hand for every sale.

**Paste the link** into `buyUrl` in `site.js` and you are selling.

### Fulfilment

```
payment → activate.html → buyer sends Hardware ID → you run keygen → key by email
```

On your side that is one command, run in the application repository:

```bash
python tools/keygen.py issue
```

It asks for the Hardware ID, customer, validity and a note, then prints the key
and records it in your ledger. `keygen.py list` shows everything you have issued.

Automate later if volume justifies it: NOWPayments fires an IPN webhook on
confirmation, a small script verifies the signature and calls the same command.
That needs a server running permanently, which early sales will not pay for.

### Things worth knowing before the first sale

- **Verification.** NOWPayments applies KYC at certain volumes and reviews what
  you sell. Rocket-engine design software is not an everyday category — expect
  to be asked, and answer plainly. Better than a freeze after money has moved.
- **Fees** are around 0.5 % plus network. Cheap next to a merchant of record's
  ~5 % — but an MoR also handles VAT and sales tax, and NOWPayments does not.
  That is entirely yours.
- **Underpayments** happen: network fees can leave a payment a few cents short.
  Set a tolerance in the dashboard or those orders hang as "partially paid".
- **No chargebacks.** Good for you. It also means a refund is a manual transfer,
  so the demo is doing real work — let people convince themselves before paying.
- **Bookkeeping.** Record the fiat rate at the moment of receipt, from the very
  first payment. Reconstructing a year of rates afterwards is miserable.

### Adding card payments later

There is no card-checkout button in the current build. If you add a provider,
put its link in a second config field and render a second button beside the
crypto checkout. Most engineers reach for a corporate card rather than a wallet,
and a merchant of record (Paddle, Lemon Squeezy) becomes the legal seller and
deals with VAT worldwide. Paddle also issues company invoices, which matters
when the buyer expenses it.

## Launch checklist

- [ ] `buyUrl`, `demoUrl`, `contactEmail` set in `site.js` (one place, all pages)
- [ ] NOWPayments success URL points at `https://www.cstar.space/activate.html`
- [ ] Price checked — every occurrence is driven by `data-price` / `data-price-note`
- [ ] Hero KPI numbers match the current build
- [ ] `CSTAR_v1.0.exe` uploaded as a release asset, link tested in a private window
- [ ] Domain checked in `CNAME`, `robots.txt` and `sitemap.xml`
- [ ] Console is clean on the published URL
- [ ] One test purchase end to end, including the activation email
- [ ] Validation report prints cleanly to PDF
- [ ] Terms of sale, privacy notice, and — as a German business — an Impressum
