# Deployment Guide

This file explains how to push the project to GitHub, set up Firebase, and deploy to Vercel.

## 1. Push to GitHub
1. Create a repo on GitHub (e.g. `sanskaran-bloodbank`).
2. From your local project:
```bash
git init
git add .
git commit -m "Initial commit - Next.js + Firebase starter"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/sanskaran-bloodbank.git
git push -u origin main
```

## 2. Firebase Setup
1. Create a Firebase project in the Firebase Console.
2. Add a Web App to the project and copy the config keys.
3. Enable Authentication (Email/Password).
4. Create Firestore database (start in test mode for dev).
5. Install firebase-tools and login:
```bash
npm install -g firebase-tools
firebase login
firebase init functions firestore
```
6. Set functions config (encryption key):
```bash
firebase functions:config:set encryption.key="replace_with_a_strong_secret_32_chars_min"
```
7. Deploy functions:
```bash
cd functions
npm run deploy
```

## 3. Vercel Setup
1. Create an account on Vercel.
2. Import your GitHub repo.
3. Add Environment Variables (NEXT_PUBLIC_FIREBASE_*) matching `.env.local`.
4. Deploy — Vercel will build and publish.

