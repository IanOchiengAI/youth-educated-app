# 🦁 Youth Educated — Life Skills for Kenyan Youth

**Youth Educated** is a safe, AI-powered life-skills application designed specifically for young people in Kenya aged 10–22. It combines modern technology with human mentorship to help the next generation learn, grow, and navigate the transition to adulthood.

---

## ✨ Key Features

- **Jabari AI Mentor:** A supportive companion powered by Gemini Flash 2.0. Jabari uses the Socratic method to guide students through career questions, mental health, and social challenges.
- **Interactive Practice:** Specialized "Roleplay" and "Quiz" modes to practice real-world scenarios (like job interviews).
- **Localized Learning:** Tailored modules covering Sexual & Reproductive Health (SRH), Financial Literacy, and Drug Awareness, all adapted for the Kenyan context.
- **Human Mentorship:** A dedicated dashboard for human mentors to oversee progress and receive AI-generated briefings before sessions.
- **Safeguarding First:** A robust, keyword-based safeguarding system that escalates sensitive issues to human DSLs (Designated Safeguarding Leads).
- **Offline First:** Built as a PWA with local database support to ensure functionality in areas with limited connectivity.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Vanilla CSS + Tailwind
- **AI Engine:** Google Gemini (2.0 Flash)
- **Database/Auth:** Supabase (PostgreSQL) + Row Level Security (RLS)
- **Mobile Wrapper:** Capacitor (ready for Android/iOS)
- **State Management:** React Context API

## 📖 Documentation & Handover

For developers taking over the project or mentors looking for guides, please see the `docs/` folder:

- [**Developer Handover Notes**](docs/handover_notes.md): Comprehensive technical details on the AI logic, Supabase schema, and Mentor Dashboard.
- [**Final Project Walkthrough**](docs/walkthrough.md): A summary of recent milestones and verification results.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase Project
- A Google Gemini API Key

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/IanOchiengAI/youth-educated-app.git
   cd youth-educated-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file (it comes pre-filled with the shared keys):
   ```bash
   cp .env.example .env
   ```
   > On Windows PowerShell, use: `Copy-Item .env.example .env`

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The server will start on [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Troubleshooting & Common Issues

If you're having trouble running the app, check the following:

### 1. Missing `.env` File
The app requires a `.env` file in the root directory. Ensure it contains the following (copy from `.env.example`):
```env
VITE_GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```
Note: To use the AI features, you **must** provide a valid Gemini API key. Without it, the app will fallback to offline/limited mode.

### 2. Node.js Version
The project uses Vite 6 and React 19, which require **Node.js v18 or newer**. Check your version with:
```bash
node -v
```

### 3. Port 3000 in Use
If the dev server fails to start, another process might be using port 3000. You can change the port in `vite.config.ts` or stop the other process.

### 4. Dependency Errors
If `npm install` fails, try clearing your npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
(We recently removed some unused native dependencies like `better-sqlite3` to fix installation issues on Windows/Linux environments without build tools.)

## 🏗️ Deployment

- **Web:** Deploy to Vercel, Netlify, or Firebase Hosting.
- **Android:** 
  ```bash
  npm run build
  npx cap sync android
  npx cap open android
  ```

---

<p align="center">Made with ❤️ for the youth of Kenya.</p>
