# Portfolio (React + Vite)

Enhanced portfolio with:
- Dark/Light theme toggle
- Mobile menu improvements
- Advanced animations (parallax, scroll-triggered)
- Animated statistics in About
- Back to Top button
- Functional contact form with backend
- Skills filter/search
- New sections: Blog, Testimonials, Timeline

## Quick Start

1) Install dependencies

```powershell
cd "C:\Users\sonuk\Desktop\Portfolio\profile"
npm install
```

2) Start frontend

```powershell
npm run dev
```

3) Start backend (contact API)

```powershell
npm run server
Or start both together:

```powershell
npm run dev:all
```
```

Visit the frontend URL (shown by Vite) and ensure the backend runs on `http://localhost:5000`.

## SMTP Setup (optional)
Create a `.env` in `profile` with:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
FROM_EMAIL=you@example.com
TO_EMAIL=you@example.com
```

Without SMTP, the API accepts messages but won’t send email.

## Notes
- Theme state persists in `localStorage`.
- Skills can be searched via the input in the Skills section.
- New sections have anchors used by the navbar.
