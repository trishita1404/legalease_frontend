This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# Legalease Frontend

Frontend application for the Legalease platform.

## Features

- User Authentication
- Role-based Dashboard
- Lawyer & Client Management
- Case Tracking System
- Appointment Management
- Notifications
- Payment Integration
- Real-time Messaging
- Responsive UI

## Tech Stack

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Axios

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_BASE_URL=https://legalease-backend-d2yt.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

## Project Structure

```text
src
├── app
│   ├── auth
│   │   ├── login
│   │   ├── register
│   │   └── verify-otp
│   │
│   ├── dashboard
│   │   ├── announcements
│   │   ├── appointments
│   │   ├── calender
│   │   ├── cases
│   │   │   └── [id]
│   │   ├── documents
│   │   ├── lawyer-requests
│   │   ├── logs
│   │   ├── message
│   │   ├── payments
│   │   ├── requests
│   │   ├── settings
│   │   ├── users
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── auth
│   │   ├── LoginForm.tsx
│   │   ├── OtpVerify.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── dashboard
│   │   ├── role-views
│   │   │   └── ClientTimeline.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── NotificationBell.tsx
│   │   └── UserNav.tsx
│   │
│   ├── landing
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   └── HowItWorks.tsx
│   │
│   ├── shared
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   │
│   └── ui
│       └── (shadcn ui components)
│
├── hooks
│   └── use-mobile.ts
│
├── lib
│   ├── axios.ts
│   └── utils.ts
│
├── store
│   └── useAuthStore.ts
│
└── .env.local
```

## Author

Trishita Dey