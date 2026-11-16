# Looking after the BAACINC site

A short list. Do the monthly pass even when nothing seems wrong. The yearly pass includes the domain, which expires if nobody renews it.

The site is static. There is no hosting bill from GitHub Pages for a public repository. The domain renewal is the one date that costs money and takes the site, and the email, offline if it is missed.

## Every month

- Open GitHub → this repository → Security, and the Pull requests list. Read Dependabot updates and any security alerts. Merge the ones that are routine version bumps after the check is green. Ask for help before merging something you do not understand.
- Open the link-check workflow under Actions. If it failed, an issue titled "Link check failed" should be open. Fix the link or, if the link is the LinkedIn profile that still needs confirming, leave the exclusion in `lychee.toml` and the TODO in `index.html` in place.
- On a computer and on a phone, open the live site once it is published. Confirm the menu, the service switcher, **Call 1.587.501.9612**, and **Send a note**. Send yourself a test brief and confirm it arrives at michael.brown@baacinc.com.
- Confirm the phone number and the email address on the page still match the ones you answer.

## Every quarter

- Read the Practice, Services, and About sections. Update anything that is no longer true: roles, credentials, or the services you want to offer. The experience list is optional and should stay accurate.
- Confirm the LinkedIn URL, `https://www.linkedin.com/in/michael-brown-baacinc/`. If it is the right profile and it loads, remove the TODO comment in `index.html` and remove that address from `exclude` in `lychee.toml`. If it is the wrong profile, replace the address.
- Skim `SECURITY.md`. If the form ever starts sending data somewhere other than the visitor's own email app, the privacy note on the page has to change in the same edit.
- Look at the CodeQL workflow. A green run is the goal. A new alert needs a person to read it before it is dismissed.

## Every year

- **12 January: renew the domain.** The registration is at Wix (unless it has been moved). Put a reminder on a calendar that is not only inside the website. If the domain lapses, the site and Google Workspace email can both stop.
- Check HTTPS. Visit `https://www.baacinc.com/` and `https://baacinc.com/`. The browser should show a lock, the certificate should be valid, and GitHub Pages should still have **Enforce HTTPS** turned on. `http://` addresses should bounce to `https://`.
- Read `docs/HOSTING-AND-DOMAIN.md` once, in case GitHub has changed the Pages screens. The four A records and four AAAA records are copied from GitHub's own documentation. If GitHub publishes new addresses, update that file and the DNS together.
- The footer year is set by `js/site.js`, with **2026** shown if the script does not run. You do not edit the year by hand.

## What not to do in a hurry

- Do not delete MX or TXT records. Those are the email.
- Do not turn off GitHub Pages while the domain still points at it, or someone else can claim the hostname.
- Do not add an analytics script, a font host, or a form plugin. The Content Security Policy will block it, and that block is intentional.
