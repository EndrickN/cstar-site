# CSTAR landing page

A single static page. No build step, no framework, no dependencies — `index.html`
plus the `assets/` folder is the whole site.

```
site/
  index.html          the page (styles and script inline)
  assets/
    flowfield.png     real solver output
    gasdynamics.png   real solver output
    thermal.png       real solver output
    structural.png    real solver output
    logo.png
    fonts/            Geist + Geist Mono, same as the application
```

---

## 1. Connect payments — the only edit you must make

Open `index.html`, scroll to the bottom, and edit the `SITE_CONFIG` block:

```js
const SITE_CONFIG = {
  price:        '€149',
  priceNote:    'one-time',
  buyUrl:       '',                    // ← paste your checkout link
  demoUrl:      '',                    // ← direct link to CSTAR_v1.0.exe
  contactEmail: 'sales@example.com',   // ← your address
};
```

That is all the wiring there is. Every Buy button on the page reads `buyUrl`,
every download button reads `demoUrl`. Leave a field empty and its button falls
back to a `mailto:` link, so the page is never broken while you are still
setting things up — and the browser console tells you what is still missing.

### What to paste into `buyUrl`

Any provider that gives you a checkout URL works, because a URL is all the page
needs.

| Provider | What the link looks like | Notes |
|---|---|---|
| **Lemon Squeezy** | `https://yourstore.lemonsqueezy.com/checkout/buy/<uuid>` | Merchant of record — handles VAT/sales tax worldwide for you |
| **Paddle** | `https://pay.paddle.io/hsc_<id>` | Merchant of record, same benefit |
| **Gumroad** | `https://yourname.gumroad.com/l/cstar` | Simplest to set up, takes a larger cut |
| **Stripe** | `https://buy.stripe.com/<id>` | Payment Link. Cheapest, but tax is your problem |
| **BTCPay Server** | your own instance's pay-button URL | Self-hosted crypto, no intermediary, no KYC on you |

If you are selling across borders, a **merchant of record** (Lemon Squeezy or
Paddle) is usually worth the fee: they become the legal seller and deal with VAT
in every jurisdiction, which is otherwise a genuine ongoing burden.

### Delivering the license after payment

Licensing is offline and machine-bound, so the flow is:

1. customer pays → provider sends them a receipt,
2. customer sends you their Hardware ID,
3. you run `python keygen.py issue <HWID> -d 365 -n "Name"` and email the key back.

Every provider above can show a custom "thank you" message or redirect after
checkout — put the instruction there: *"Open CSTAR, copy your Hardware ID from
the activation dialog, and reply to your receipt with it."* That single sentence
removes almost all of the support load.

Automate it later if volume justifies it: the provider fires a webhook, a small
script calls the same `keygen.py issue`, and the key goes out by email.

---

## 2. Host it

Any static host. Drag-and-drop the `site/` folder:

- **Cloudflare Pages** — free, fast, custom domain included
- **Netlify** — drag the folder onto the dashboard, done
- **Vercel** — same
- **GitHub Pages** — free if the repo is public

For the demo executable, either drop `CSTAR_v1.0.exe` into `assets/` and point
`demoUrl` at `assets/CSTAR_v1.0.exe`, or host it as a GitHub release asset and
link that. A release asset is usually better: it does not bloat the site deploy
and you get download counts.

Test locally first:

```bash
python -m http.server 8000
```

then open `http://localhost:8000`. Opening `index.html` directly from disk works
too, but relative paths behave better over HTTP.

---

## 3. Refreshing the screenshots

The charts are real output, regenerated from the shipped example engine:

```bash
python tools/build_site_assets.py
```

Re-run it after any solver change so the site never shows stale numbers. It also
prints the figures quoted in the hero KPI strip (thrust, Isp, wall temperature,
safety factors) — if those change, update the numbers in `index.html` to match.

---

## 4. Before you go live

- [ ] `buyUrl`, `demoUrl` and `contactEmail` filled in
- [ ] Price checked (it appears in three places, all driven by `SITE_CONFIG`)
- [ ] Hero KPI numbers match the current build
- [ ] Post-purchase instruction set in your payment provider
- [ ] A real screenshot of the running application, if you want one in the hero
      instead of the chart-in-a-frame composition
- [ ] Legal pages: the footer disclaimer is deliberately strong but it is not a
      substitute for terms of sale, a privacy notice, or — as a German business
      — an Impressum
