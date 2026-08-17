# CSTAR landing page

Static site. No build step, no framework, no dependencies, no external requests
— the folder is the site.

```
site/
  index.html        the landing page (styles + script inline)
  activate.html     post-purchase page: collects the buyer's Hardware ID
  404.html          styled not-found page
  CNAME             the custom domain - see the warning below
  robots.txt        keeps activate.html out of search results
  sitemap.xml
  assets/           real solver output, logo, and the app's own fonts
```

**Do not delete `CNAME`.** GitHub Pages reads the custom domain from that file.
Setting the domain in the repository's Settings creates it on GitHub's side, but
this repository is published with `git subtree push`, which overwrites the
published tree - so a CNAME that exists only on GitHub is wiped by the next
publish and the domain silently stops working. Keeping it in `site/` means it
travels with everything else.

---

## 1. Fill in SITE_CONFIG

At the bottom of `index.html`:

```js
const SITE_CONFIG = {
  price:        '$149',
  priceNote:    'one-time',
  buyUrl:       '',                    // ← NOWPayments checkout link
  buyCardUrl:   '',                    // ← optional card checkout
  demoUrl:      'https://github.com/EndrickN/cstar-site/releases/latest/download/CSTAR_v1.0.exe',
  contactEmail: 'cstar.propulsion@gmail.com',
};
```

`activate.html` has its own smaller copy of `demoUrl` and `contactEmail` — keep
the two in step.

Anything left empty degrades to a `mailto:` link rather than dead-ending a
visitor, and the browser console lists what is still missing. You can publish
before payments are wired and take enquiries by email in the meantime.

---

## 2. NOWPayments, step by step

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
| Success URL | `https://YOUR-DOMAIN/activate.html` |
| Cancel URL | `https://YOUR-DOMAIN/#pricing` |

**The success URL is the important one.** Licences are hardware-bound, so a key
cannot exist until the buyer has run the app once and read their Hardware ID.
`activate.html` walks them through exactly that. Point the success URL at a
generic "thank you" page instead and you will answer *"I paid, where is my
key?"* by hand for every sale.

**Paste the link** into `buyUrl` and you are selling.

### Fulfilment

```
payment → activate.html → buyer sends Hardware ID → you run keygen → key by email
```

On your side that is one command:

```
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

Set `buyCardUrl` and a second button appears automatically. Most engineers reach
for a corporate card rather than a wallet, and a merchant of record (Paddle,
Lemon Squeezy) becomes the legal seller and deals with VAT worldwide. Paddle
also issues company invoices, which matters when the buyer expenses it.

---

## 3. Host it

Any static host. Drag the folder onto **Cloudflare Pages**, **Netlify** or
**Vercel**; all three are free with a custom domain and HTTPS.

**GitHub Pages** works too, with two caveats:

- Pages needs a **public** repository on the free plan. Publish only this
  folder — never the application source, which sits one level up.
- Pages serves from the repository root, `/docs`, or a branch. Put the contents
  of `site/` at the root of that repository, not inside a `site/` folder.

Test locally first:

```
python -m http.server 8000
```

### The demo executable

Do **not** commit the 55 MB binary. Git keeps every version forever, so ten
rebuilds means 550 MB of history you cannot reclaim, and Pages has a ~100 GB
monthly bandwidth allowance — about 1800 downloads at this size.

Publish it as a **GitHub Release asset** instead: it stays out of the repository,
allows up to 2 GB, and gives you download counts, which is your first real signal
about the funnel. Then:

```js
demoUrl: 'https://github.com/EndrickN/cstar-site/releases/latest/download/CSTAR_v1.0.exe'
```

`latest/download` is a permanent link — new releases do not need a site edit.

---

## 4. Refreshing the screenshots

The charts are genuine solver output, not mockups:

```
python tools/build_site_assets.py
```

Re-run after any solver change. It also prints the figures quoted in the hero
KPI strip; if those move, update them in `index.html` to match.

---

## 5. Launch checklist

- [ ] `buyUrl`, `demoUrl`, `contactEmail` set in **both** `index.html` and `activate.html`
- [ ] NOWPayments success URL points at `https://YOUR-DOMAIN/activate.html`
- [ ] Price checked — it appears in three places, all driven by `SITE_CONFIG`
- [ ] Hero KPI numbers match the current build
- [ ] `CSTAR_v1.0.exe` uploaded as a release asset, link tested in a private window
- [ ] Domain placeholders replaced in `robots.txt` and `sitemap.xml`
- [ ] Console is clean on the published URL (it warns about missing config)
- [ ] One test purchase end to end, including the activation email
- [ ] Terms of sale, privacy notice, and — as a German business — an Impressum
