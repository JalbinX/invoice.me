# JalbinX Invoice Maker

index.html = the invoice app. api/send.js = sends the email through Gmail.

## 1. Gmail app password
1. Go to myaccount.google.com/security and turn on 2-Step Verification.
2. Search "App passwords" in your Google account, make one named "invoice".
3. Copy the 16 character password.

## 2. Put it on GitHub
Make a new repo and upload everything in this folder (index.html, package.json, api/send.js).

## 3. Deploy on Vercel
1. vercel.com, Add New Project, import the repo, press Deploy.
2. Project Settings, Environment Variables, add:
   - GMAIL_USER = your Gmail address
   - GMAIL_APP_PASSWORD = the 16 character password
   - SEND_PASSCODE = any passcode you make up
   - FROM_NAME = JalbinX (optional)
3. Deployments tab, Redeploy so the variables apply.

## 4. Use it
Open your Vercel link, fill the invoice, tap Email client. First time it asks for your passcode and remembers it on that device.
