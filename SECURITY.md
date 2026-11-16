# Security

BAACINC is a static site. It has no accounts, no database, and no server-side code. The only script is `js/site.js`, loaded from this site.

## Reporting a problem

Email michael.brown@baacinc.com and describe what you saw. Do not send passwords. This repository should never contain passwords, API keys, or mailbox credentials.

## Content Security Policy

Both HTML pages send a Content Security Policy in a meta tag:

- Scripts, styles, images, and fonts must come from this site.
- Inline scripts are not allowed. Behaviour lives in `js/site.js`.
- The project brief cannot be posted to a URL. `form-action` is `none`. The script opens a `mailto:` link instead.
- Objects and frames are not allowed.

`frame-ancestors` is not in the meta policy. Browsers ignore it there and log a console error. It only works as a real HTTP header. GitHub Pages cannot set custom headers. If the domain later sits behind Cloudflare, send the same policy as a response header and add `frame-ancestors 'none'`, plus:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` once HTTPS is confirmed

`upgrade-insecure-requests` is deliberately omitted. It would rewrite local preview (`http://127.0.0.1`) onto HTTPS and break the page. Production should be HTTPS because GitHub Pages and the custom domain enforce it, not because the page upgrades its own requests.

A referrer policy meta tag is set to `strict-origin-when-cross-origin`. Links that leave the site use `rel="noopener noreferrer"`.

## The project brief

The form does not submit anywhere. It checks the fields in the browser, then opens the visitor's email app with a message addressed to michael.brown@baacinc.com. BAACINC receives the text only if the visitor sends that email.

A draft is written to `localStorage` on the visitor's device under the key `baacinc.projectBrief.v1`. The firm cannot read it. **Clear draft** deletes it. Say this plainly on the page if the behaviour changes. Do not replace the form with a third-party form host without rewriting the privacy note.

## Dependencies and alerts

The published site has no runtime dependencies. `package.json` lists `html-validate` for the pull-request check only.

Dependabot opens weekly updates for GitHub Actions and, because `package.json` exists, for npm. Review those pull requests. Do not ignore a security alert because the site "is only HTML."

CodeQL scans the JavaScript on each pull request and once a week. The link checker runs on pull requests, on pushes, and once a week, and opens an issue when it fails. A pull request from a fork may not be able to open that issue; the check itself still fails.

## Domain and email

The domain registration stays at Wix unless a later, separate decision moves it. Google Workspace mail depends on the MX and TXT records. Do not delete or edit those records while pointing the website at GitHub Pages. Steps and the warning are in `docs/HOSTING-AND-DOMAIN.md`.

The LinkedIn address on the contact section was copied from the previous site and may be unpublished. It is marked with a TODO in `index.html` and excluded from the link checker until someone confirms it.
