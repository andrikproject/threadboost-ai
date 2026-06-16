# ThreadBoost AI

Web app AI untuk bikin utas Threads Indonesia yang natural, gaul, dan siap posting.

## Fitur
- 📖 Storytelling Mode
- 🛍️ Marketing Mode  
- 💬 Engagement Mode
- 🔗 Shopee Affiliate Maker
- 🤫 Secret Viral Thread
- 🌀 Viral Thread Spinner
- 👥 Multi-Persona Switcher
- 🔔 Daily Reminder
- ✨ Quick Tools (Humanize, Punchline, Soft-Selling, Clean Caption)

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- Firebase Auth + Firestore
- OpenAI-compatible API (https://ai.sumopod.com/v1)

## Setup

1. **Firebase Setup**
   - Buat project di [Firebase Console](https://console.firebase.google.com)
   - Aktifkan Authentication → Google Sign-In
   - Aktifkan Firestore Database
   - Ganti konfigurasi Firebase di `src/firebase.js`

2. **API Key**
   - Dapatkan API key dari Sumopod dashboard
   - Masukkan di halaman Pengaturan setelah login

3. **Run**
```bash
npm install
npm run dev
```

4. **Build**
```bash
npm run build
```

5. **Deploy ke Firebase**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```
