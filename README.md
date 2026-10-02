# Streamline — website

Single-page site for Streamline: sourcing and logistics from China to the UAE and Saudi Arabia.
Built with Next.js (static export), Tailwind CSS and Framer Motion. No server needed.

## Change content before launch

Almost everything you'll want to edit is in **`lib/constants.ts`**:

| What | Where |
| --- | --- |
| WhatsApp number (buttons stay hidden until set) | `CONTACT.whatsapp`, `CONTACT.whatsappDisplay` |
| Email | `CONTACT.email` |
| Tally form | `TALLY_FORM_ID` (the part after `tally.so/r/`) |
| Live domain (SEO, sitemap) | `SITE.url` |
| Air / sea timelines + disclaimer | `TIMELINES` |
| Founder story | `FOUNDER` |

Journey stage copy lives in `lib/journey.ts`. Services and "Why Streamline" copy are in
`components/Services.tsx` and `components/Why.tsx`.

**Tally form fields to have:** Name, Company, Email, WhatsApp, Destination, Product needed,
Quantity, Additional notes.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in /out
```

Node 20 or newer.

## Deploy (GitHub → Netlify)

`netlify.toml` already sets the build command (`npm run build`) and publish folder (`out`).

1. Netlify → **Add new site → Import an existing project → GitHub**.
2. Pick `koraykanbur/streamline-web`. Settings are read from `netlify.toml`.
3. Deploy. Every push to `main` redeploys automatically.
4. Custom domain: **Site configuration → Domain management**.

## How the map works

- `scripts/generate-map.mjs` turns Natural Earth land data into the dotted map
  (`lib/map-dots.ts`, `lib/map-fine.ts`). Run `npm run gen:map` only if you change the map area.
- `components/JourneyMap.tsx` draws routes, nodes and vehicles and moves the camera
  as a pure function of scroll position.
- Desktop gets the pinned map; phones and anyone with "reduce motion" turned on get the
  vertical journey (`components/JourneyVertical.tsx`).
