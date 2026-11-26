# BAACINC website

Static website for BAACINC, Michael Brown's planning practice in Calgary and Edmonton.

The page is one file of HTML, a stylesheet, and a small script. There is no server, no database, and no third-party form service. The project brief opens the visitor's own email app. A draft of that brief stays in the visitor's browser until they clear it.

Photographs and the words on the page are © BAACINC, all rights reserved. The code is MIT. See `LICENSE`.

## Preview on your computer

From this folder:

```bash
npm install
npm run preview
```

Then open <http://127.0.0.1:8080/>.

`npm install` is only for the HTML check. The site itself does not need it. If you do not want Node, this is enough:

```bash
python3 -m http.server 8080
```

Open the site through that address. Opening the HTML file directly (`file://`) will not load the stylesheet, because the links start at the site root.

What to try:

- **Book a 20-minute project call** and **Email Michael**.
- Submit an empty brief and confirm the form names the missing fields. Fill it and choose **Send the brief**. Your email app should open a message to michael.brown@baacinc.com. If it does not, use **Copy brief**.
- Reload the page before sending. The draft should still be there. **Clear draft** removes it.
- Narrow the window, or use a phone. The menu becomes a button, and a bar at the bottom offers **Call** and **Email**.

Check the markup with:

```bash
npm run validate
```

## What is in this repository

| Path | Purpose |
| --- | --- |
| `index.html` | The site |
| `404.html` | Missing-page message |
| `css/styles.css`, `js/site.js` | Layout and behaviour |
| `assets/` | Portrait, engagement image, monogram, share card |
| `robots.txt`, `sitemap.xml` | Search engines |
| `CNAME` | Records the intended domain, `www.baacinc.com` |
| `.github/workflows/` | Checks, and a Pages deploy that is not turned on |
| `docs/HOSTING-AND-DOMAIN.md` | How to publish, when you are ready |
| `docs/MAINTENANCE.md` | What to look at through the year |
| `SECURITY.md` | How the site is locked down, and how to report a problem |

## Deploy

Nothing in this repository turns the site on.

GitHub Pages is not enabled. DNS is not changed. The live site at <https://www.baacinc.com/> stays on Wix until you follow `docs/HOSTING-AND-DOMAIN.md`.

Do that only after you have read the page and are happy with it. The steps are written for a person who does not spend the day in GitHub. The short version is: merge this work, turn on GitHub Pages with the Actions workflow, set the custom domain to `www.baacinc.com`, then change only the website DNS records at Wix. Leave the email records alone.
