# Putting the BAACINC site on the web

This repository is the new site. It is not live. The pull request does not turn on GitHub Pages, does not change DNS, and does not change repository settings.

The site people see today is still the Wix page at `https://www.baacinc.com/`. It stays that way until you do the steps below, in order.

Do the GitHub steps before you change DNS. GitHub's own instructions say to attach the domain in the repository first. If the DNS is pointed at GitHub before the repository knows about the domain, someone else could host a page on that name.

## Leave the email alone

**Do not edit, delete, or replace MX records or TXT records.**

Those records are Google Workspace. They are why mail to `michael.brown@baacinc.com` arrives. The website uses different records (A, AAAA, and a CNAME for `www`). Touch only those.

**Keep the domain registered at Wix** unless you later choose the optional Cloudflare move at the bottom of this page. Moving or cancelling the registration is a separate decision. Cancelling it takes the name away from you.

## What you are pointing where

| Name | Type | Value |
| --- | --- | --- |
| Apex (`baacinc.com`, often shown as `@`) | A | `185.199.108.153` |
| Apex | A | `185.199.109.153` |
| Apex | A | `185.199.110.153` |
| Apex | A | `185.199.111.153` |
| Apex | AAAA | `2606:50c0:8000::153` |
| Apex | AAAA | `2606:50c0:8001::153` |
| Apex | AAAA | `2606:50c0:8002::153` |
| Apex | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `confessedemu.github.io` |

Add all four A records and all four AAAA records. The CNAME for `www` must be `confessedemu.github.io`, with no repository name on the end, and no `https://`.

These addresses come from GitHub's documentation for GitHub Pages: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). If GitHub changes them, use the addresses on that page.

The file `CNAME` in this repository contains `www.baacinc.com`. That is the domain this project is built for. When the site is published by the Actions workflow below, GitHub does not read that file. You still type the domain into the Pages settings. The file is there so the intended name is in the project, and so a future branch-based publish would keep it.

## 1. Merge the pull request

Review the page first. On your computer, the README explains how to preview it.

When you are satisfied, merge the pull request into `main`. Do not squash away the `CNAME` file.

## 2. Turn on GitHub Pages

This is a repository setting. It is not switched on by the pull request.

1. Open the repository on GitHub: `confessedemu/BAACINC-website`.
2. Settings → Pages.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

The workflow `.github/workflows/deploy.yml` runs when `main` changes. It publishes only the site files (the HTML, CSS, JavaScript, images, `robots.txt`, `sitemap.xml`, and `CNAME`). It does not publish this docs folder.

The workflow calls GitHub's Pages actions with Pages enablement left off, so simply having the file in the repository does not enable Pages. Until you choose **GitHub Actions** as the source, a run of that workflow can fail. That failure is expected before this step.

You can also run the workflow by hand from the Actions tab after Pages is on (**Deploy GitHub Pages** → **Run workflow**).

## 3. Tell GitHub the domain, then check it

1. Still in Settings → Pages, under **Custom domain**, enter `www.baacinc.com` and save.
2. GitHub will offer a DNS check. It will not pass until step 4 is done. That is fine.
3. Verify the domain for GitHub Pages so another project cannot claim it. The control is on the same Pages screen, **Verify**. GitHub shows a TXT record for verification. Add that TXT record only. Do not remove the Google Workspace TXT records that are already there. A verification TXT is an extra record, not a replacement.

Wait to turn on **Enforce HTTPS** until DNS has settled and the option is available. GitHub says this can take up to 24 hours after the domain is correctly pointed. Then turn **Enforce HTTPS** on and leave it on.

## 4. Change the website records at Wix

Log in to Wix, open the domain `baacinc.com`, and open the DNS records.

Before you add anything, write down every existing record, or take a screenshot. You need that screenshot if mail breaks.

Then:

1. Find the records that currently send the **website** to Wix. They are usually A records on `@` and a CNAME on `www`. Remove or replace those website records so they no longer point at Wix.
2. Add the four A records and the four AAAA records from the table above, on the apex (`@` or the blank host, whichever Wix shows).
3. Set the `www` CNAME to `confessedemu.github.io`. If a `www` CNAME already points at Wix, change that value. Do not create a second `www` CNAME.
4. **Stop.** Do not edit MX records. Do not edit the Google TXT records (SPF, DKIM, DMARC, and the site-verification TXT Google already uses). You may add GitHub's domain-verification TXT from step 3. That is a new row, not an edit of the Google rows.
5. Do not add a wildcard such as `*.baacinc.com`.

DNS can take a few minutes or up to a day. When it is ready:

- `https://www.baacinc.com/` shows this site, not the Wix page.
- `https://baacinc.com/` redirects to `https://www.baacinc.com/`.
- Send a test email to and from `michael.brown@baacinc.com`. If mail fails, restore the MX and TXT records from your screenshot. The website records are not the cause if you left MX and TXT untouched.

Wix may warn that the domain is no longer connected to a Wix site. That warning is expected. You are keeping Wix as the registrar and leaving the Wix site unpublished at this domain. You can keep the Wix project as a private copy. Do not let Wix "fix" the DNS for you. Its fix would point the name back at Wix and undo this change.

## 5. Walk the live page once

- Phone: the bottom bar shows **Call** and **Send a note**. Call the number.
- Computer: open a service, choose **Ask about this**, and confirm that service is selected in the brief.
- Send a real test brief to yourself.
- View the page source or the page information and confirm the address is `https://`.

## If the temporary GitHub address looks unstyled

Before the custom domain is attached, GitHub may offer `https://confessedemu.github.io/BAACINC-website/`. This site's links start at the domain root (`/css/styles.css`), which is correct for `www.baacinc.com` and wrong for a project subpath. Use the local preview in the README until the custom domain is in place. Do not judge the design from the unstyled subpath.

## Optional: Cloudflare Registrar and the free proxy

You do not need Cloudflare to go live. The steps above are the whole launch.

Later, if you want the domain registered at Cloudflare and the free proxy (their firewall, DDoS protection, and the ability to add security headers), this is the shape of that move. It is optional, and it is easy to break email if it is rushed.

1. At Cloudflare, start a registrar transfer for `baacinc.com`. Unlock the domain at Wix and copy the transfer code Wix gives you. Transferring the registration does not by itself change where the website or the email points, but the new registrar becomes the place you edit DNS. Finish the transfer only when you have a full copy of every DNS record, including every MX and TXT.
2. Recreate **every** record at Cloudflare before you rely on it. The GitHub A, AAAA, and `www` CNAME from the table above. **And** every Google Workspace MX and TXT, copied exactly. Missing an MX record means mail stops.
3. Leave the GitHub records as **DNS only** (the grey cloud) until `https://www.baacinc.com/` works and **Enforce HTTPS** is on at GitHub. GitHub has to be able to see the domain pointing at GitHub to issue the certificate. An orange-cloud proxy in front of the name too early can block that.
4. When HTTPS already works, you may turn the proxy on (orange cloud) for the A, AAAA, and `www` records. Set Cloudflare SSL/TLS to **Full (strict)**. Turn **Always Use HTTPS** on. Do not enable email address obfuscation or Rocket Loader. Both rewrite the page and will fight the Content Security Policy.
5. Add the response headers from `SECURITY.md` in a Cloudflare response-header rule: the Content Security Policy (this time as a real header, so `frame-ancestors` counts), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security` only after you have confirmed HTTPS.
6. Keep a screenshot of the working DNS. If the proxy causes a redirect loop or a certificate error, switch those records back to DNS only. The site keeps working on GitHub's certificate.

The proxy is extra protection in front of a site that has no server of its own. It is not required for the site to be safe enough to publish. The strict policy in the page, the absence of third-party scripts, and HTTPS from GitHub Pages are the baseline.
