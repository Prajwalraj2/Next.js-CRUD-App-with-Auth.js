# Next.js CRUD App (Products) + Auth.js

A minimal product CRUD starter using **Next.js (App Router)**, **Prisma + PostgreSQL**, and **Auth.js (Google & GitHub)**.  
Creating/editing products requires login. Auth is enforced via **middleware** and **page-level server checks**.

---

## Features
- Products CRUD (Next.js App Router + Prisma ORM)
- Auth.js (NextAuth v5) with **Google** & **GitHub** providers
- **Protected routes** with middleware + page-level session checks
- TailwindCSS styling
- Zod validation for server actions

---

## Tech Stack
- Next.js 15 (App Router)
- Auth.js (NextAuth v5) + Prisma Adapter
- PostgreSQL + Prisma ORM
- TailwindCSS
- Zod

---

## Getting Started (Local)

### 0) Prerequisites
- **Node.js** 18+ (recommend 20+)
- **PostgreSQL** running locally
- A **Google OAuth** app and a **GitHub OAuth** app  
  Callback URLs must be set to:
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/github`

---

### 1) Clone
```bash
git clone https://github.com/Prajwalraj2/Next.js-CRUD-App-with-Auth.js.git
cd Next.js-CRUD-App-with-Auth.js

```
### 2) Install dependencies
```
npm install
```
### 3) Environment variables
Create .env from the example and fill in your values:

```
cp .env.example .env
```

Required keys:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/next_crud?schema=public

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me_with_a_strong_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
### 4) Database setup
```
npx prisma migrate dev
npx prisma generate
```

### 5) Run the app
```
npm run dev
# open http://localhost:3000
```

### 6) Sign in & use
- Click Login → Sign in with Google or GitHub
- Go to Products → New Product (requires login)

### Access Control (Double Checks)

- Middleware (src/middleware.ts) redirects unauthenticated users away from protected routes.
- Page-level checks validate session again before rendering sensitive pages. This ensures security even if middleware is bypassed.

### Scripts
```
npm run dev     # start dev server
npm run build   # build production bundle
npm run start   # run production server (after build)
npm run lint    # run linter
```


### Roadmap

v1.0.0 → Product create, update, delete, read | Auth with Google & Github | Protect page with Middleware & Page-Level checks
v1.1.0 → Product search & sort
v1.2.0 → API endpoints (/api/products)
v1.3.0 → Image upload for products
v2.0.0 → Roles/permissions (admin/editor)

