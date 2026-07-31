# Online Examination & Certification Portal

MERN stack project — students take timed exams, get auto-scored, and receive a PDF certificate on passing. Admins/faculty create exams and manage a reusable question bank.

## Structure
```
exam-portal-app/
  server/   Node.js + Express + MongoDB API
  client/   React (Vite) frontend
```

## 1. Backend Setup
```
cd server
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — a MongoDB Atlas connection string (free tier is fine), or `mongodb://localhost:27017/exam-portal` if you have MongoDB running locally
- `JWT_SECRET` — any long random string

Create a default admin account, then start the server:
```
npm run seed
npm run dev
```
Server runs on `http://localhost:5000`. Admin login: `admin@examportal.com` / `admin123`.

## 2. Frontend Setup
In a second terminal:
```
cd client
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 3. Try It End-to-End
1. Log in as admin (`admin@examportal.com` / `admin123`) → Manage Exams → create an exam.
2. Go to Question Bank → add a few questions, attaching them to that exam via the dropdown.
3. Back in Manage Exams, click Publish on the exam.
4. Register a new account as a Student, log in, start the exam, answer, submit.
5. If the score clears the passing marks, a Download Certificate button appears on the result page.

## Push to GitHub (tonight)
```
cd exam-portal-app
git init
git add .
git commit -m "Initial commit: Online Examination & Certification Portal"
```
Then on github.com: click **New repository** → name it (e.g. `online-exam-portal`) → do NOT initialize with a README → Create repository. GitHub will show you a remote URL, then run:
```
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Share that repository URL with your coach.

## Notes
- Scoring is always calculated server-side from `/api/results/submit` — the client never sends a score.
- The exam timer is enforced server-side too (via `startedAt`), not just in the browser.
- `.env` files are gitignored on purpose — never commit real secrets.
