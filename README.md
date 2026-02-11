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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



my-app/
├── .env.local
├── next.config.js
├── package.json
├── jsconfig.json                 # optional (for "@/..." alias)
└── src/
    ├── middleware.js             # 🔒 Protect /siteadmin/* except /siteadmin/login
    │
    ├── app/
    │   ├── layout.js             # ✅ REQUIRED root layout (Redux Provider, html/body)
    │
    │   ├── (public)/             # 🌐 Public website (URL does NOT include "(public)")
    │   │   ├── layout.js         # Public Navbar + Public Footer
    │   │   ├── page.js           # / (Home)
    │   │   ├── about/
    │   │   │   └── page.js       # /about
    │   │   └── contact/
    │   │       └── page.js       # /contact
    │   │
    │   ├── (siteadmin-auth)/     # 🔓 Admin auth group (public)
    │   │   └── siteadmin/
    │   │       └── login/
    │   │           └── page.js   # /siteadmin/login (public)
    │   │
    │   ├── (siteadmin)/          # 🔒 Admin private group (protected)
    │   │   └── siteadmin/
    │   │       ├── layout.js     # Admin Navbar + Admin Footer (only for private pages)
    │   │       ├── dashboard/
    │   │       │   └── page.js   # /siteadmin/dashboard (private)
    │   │       └── manage-admins/
    │   │           └── page.js   # /siteadmin/manage-admins (private)
    │   │
    │   └── api/                  # 🔥 Backend (App Router API routes)
    │       ├── auth/
    │       │   ├── login/
    │       │   │   └── route.js  # POST /api/auth/login (sets JWT cookie)
    │       │   ├── logout/
    │       │   │   └── route.js  # POST /api/auth/logout (clears cookie)
    │       │   └── me/
    │       │       └── route.js  # GET /api/auth/me (returns current user)
    │       │
    │       └── admins/
    │           └── route.js      # GET /api/admins (list) + POST /api/admins (create)
    │
    ├── components/
    │   ├── PublicNavbar.js
    │   ├── PublicFooter.js
    │   ├── AdminNavbar.js
    │   ├── AdminFooter.js
    │   ├── AdminLoginForm.js
    │   └── CreateAdminForm.js
    │
    ├── lib/
    │   ├── db.js                 # MongoDB connection helper (mongoose)
    │   └── jwt.js                # JWT sign/verify (jose for middleware compatibility)
    │
    ├── models/
    │   └── Admin.js              # Mongoose Admin model
    │
    └── redux/
        ├── store.js
        ├── providers.js          # "use client" Provider wrapper
        └── slices/
            ├── authSlice.js
            └── uiSlice.js
