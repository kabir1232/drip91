# DRIP91 Private Archive

A password-protected private sample room for DRIP91, built for Cloudflare Pages. It is intentionally dependency-free: no React bundle, no theme framework, no external JS animation library. The site uses native CSS/JS for better mobile performance and Cloudflare Pages Functions for actual server-side password verification.

## What is included

- Real server-side password verification using `SITE_PASSWORD`
- Secure HttpOnly session cookie, valid for 7 days
- Product/media routes protected by middleware
- Mobile-first access screen
- Separate front/back product shots, never a single stitched image pretending to be two views
- Interactive 3D front/back rotation for the black Money Over Friends sample
- Front/back toggles for both samples
- Fullscreen editorial campaign sections
- Fullscreen archive viewer
- Original placeholder rage-style instrumental loop
- Sound begins after successful password interaction when the browser allows it
- Reduced-motion support
- `noindex,nofollow`

## Product image files

Replace these while keeping the same filenames if you want to update the visuals:

- `public/products/money-front.webp`
- `public/products/money-back.webp`
- `public/products/no-love-front.webp`
- `public/products/no-love-back.webp`

The Money Over Friends combined mockup supplied for this build was split into proper individual front and back images. The No Love Club source files were already separate and remain separate.

Campaign images:

- `public/campaign/taste-editorial.webp`
- `public/campaign/certified-trapper-editorial.webp`

## Music

The included `public/audio/background.mp3` is an original synthetic placeholder loop, not a copyrighted Yeat recording.

To use your own licensed audio, replace:

`public/audio/background.mp3`

Keep that filename and no code changes are needed.

## Local Cloudflare test

Install Wrangler if you do not already have it:

```bash
npm install -g wrangler
```

Copy the example secret file:

```bash
cp .dev.vars.example .dev.vars
```

Set your local password in `.dev.vars`, then run:

```bash
npx wrangler pages dev public
```

Wrangler automatically loads Pages Functions from the `functions/` folder.

## Deploy to Cloudflare Pages

1. Put this project in a GitHub repository.
2. In Cloudflare Dashboard open **Workers & Pages** → **Create** → **Pages** → connect the repository.
3. Framework preset: **None**.
4. Build command: leave blank.
5. Build output directory: `public`.
6. Deploy.
7. In the Pages project go to **Settings** → **Variables and Secrets**.
8. Add an encrypted secret named `SITE_PASSWORD` and set your real access code.
9. Redeploy after adding the secret.

The site has no database requirement.

## Custom domain

In the Pages project open **Custom domains** and attach your preferred domain/subdomain, for example:

`private.drip91.in`

## Important files

- `public/index.html` — access screen + authentication bootstrap/audio engine
- `public/archive-fragment.html` — protected site markup
- `public/assets/site.css` — full visual system and mobile layouts
- `public/assets/site.js` — 3D tee rotation, front/back switching, sound, archive viewer
- `functions/api/login.js` — password verification and session cookie
- `functions/api/session.js` — session check
- `functions/_middleware.js` — protects the archive, images, audio and site assets

## Change colors/type

Main colors live at the top of `public/assets/site.css` under `:root`.

The site currently uses Archivo Black and Inter Tight via Google Fonts. If you want zero third-party font requests, replace the import with system/local font declarations.
