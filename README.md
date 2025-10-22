# Sanskaran Foundation - Blood Donation Management (Next.js + Firebase)

This repository is a starter for the Blood Donation Management System using **Next.js** (Vercel) and **Firebase** (Auth, Firestore, Functions, Storage).

**What it contains**
- Next.js frontend (pages) with Tailwind + boxed layout (Martian font placeholder)
- Firebase Cloud Functions for phone encryption/decryption & contact reveal workflow
- Admin UI components to request reveal and generate WhatsApp link (click-to-chat)
- Minimal Firestore data model examples and security guidance in README

---

## Quick Start (local)

1. Install dependencies:
```bash
npm install
cd functions
npm install
cd ..
```

2. Create `.env.local` in the root with your Firebase web config (see `.env.local.example`).

3. Run Next.js:
```bash
npm run dev
# app runs at http://localhost:3000
```

4. Deploy functions:
```bash
# ensure firebase-tools installed and logged in
# set encryption key (example):
firebase functions:config:set encryption.key="your-32+char-secret"
cd functions
npm run deploy
```

See `DEPLOYMENT.md` for full GitHub / Vercel / Firebase deployment instructions (generated in repo).

