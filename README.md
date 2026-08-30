# Usman Tariq — Portfolio

A static, dependency-free portfolio site (HTML5 + CSS3 + vanilla JS) built to run on GitHub Pages at no cost.

## What's inside

- Dark/light theme toggle (persisted, respects system preference)
- Typing hero headline, particle background, scroll-reveal animations, animated counters
- Tabbed skills section with animated progress bars
- Filterable project grid (data-driven — edit one array to add real projects)
- Live GitHub stats + recent repos pulled from the public GitHub REST API (no backend/keys needed)
- Testimonial slider, interactive experience timeline
- Contact form wired for Formspree or EmailJS, with a `mailto:` fallback if neither is configured — email address isn't printed as visible text anywhere on the page
- Command palette (`Ctrl/Cmd + K`), back-to-top button, custom 404 page
- SEO basics: meta tags, Open Graph/Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`

## Folder structure

```
/
├── index.html
├── 404.html
├── css/style.css
├── js/main.js
├── images/            (profile photo + placeholders — swap remaining SVGs for real screenshots)
├── assets/
├── robots.txt
├── sitemap.xml
├── favicon.ico         (SVG-based, works in modern browsers)
└── README.md
```

## 1. Deploy to GitHub Pages

1. Create a new **public** GitHub repository. For a root site (`https://yourusername.github.io`), name the repo exactly `yourusername.github.io`. For a project site instead, any repo name works and the site will live at `https://yourusername.github.io/repo-name/`.
2. Push these files to the repository's default branch (`main`):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait 1–2 minutes, then visit the URL GitHub shows on that page.

## 2. Personalize it

- **GitHub username** — in `js/main.js`, set `CONFIG.githubUsername` to your real username so the GitHub stats section pulls live data.
- **Projects** — edit the `PROJECTS` array near the top of `js/main.js`. Each entry needs `title`, `category` (`web` / `mobile` / `uiux` / `marketing`), `tags`, `desc`, `github`, `demo`.
- **Contact form** — pick one:
  - **Formspree**: create a form at formspree.io, then set `CONFIG.formspreeEndpoint` in `js/main.js` to your form URL.
  - **EmailJS**: add the EmailJS SDK `<script>` tag to `index.html`, then fill in `CONFIG.emailjs` (`serviceId`, `templateId`, `publicKey`) in `js/main.js`.
  - Leave both blank and the form will open the visitor's email client instead — works out of the box, no setup required.
- **Real photo / screenshots** — replace the SVGs in `/images` with real files (JPG/PNG/WebP) and update the matching `src` attributes in `index.html`.
- **Social links** — update the WhatsApp number, LinkedIn, GitHub, and email links in the Contact section and footer of `index.html`.
- **Domain in meta tags** — `sitemap.xml`, `robots.txt`, and the canonical/OG tags in `index.html` assume `https://usmantariq.github.io/`. Update these if you use a custom domain or project-site URL.

## 3. Notes

- `favicon.ico` is actually SVG content served with an SVG mime type via the `<link>` tag — this works in all current browsers. For maximum compatibility (older browsers, some crawlers), export a real 32×32 `.png`/`.ico` and swap it in.
- `images/og-cover.svg` is a placeholder for social share previews. Some platforms (e.g. Twitter/X) require a raster image — export it to a 1200×630 JPG/PNG for full compatibility, and update the two `og:image` / `twitter:image` tags in `index.html` accordingly.
- Everything is plain CSS and JS — no build step, no `node_modules`, so it deploys as-is.

## 4. Local preview

No build tools needed — just serve the folder locally, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
