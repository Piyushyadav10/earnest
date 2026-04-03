# TaskFlow — Task Management System

A production-ready full-stack Task Management System with JWT authentication, task CRUD operations, and a modern responsive UI.

## 🧠 Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (Access + Refresh Tokens) + bcrypt
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (with interceptors)
- **Notifications**: React Hot Toast

---

## 📁 Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.ts            # JWT verification
│   │   │   ├── error.ts           # Global error handler
│   │   │   └── validate.ts        # Zod validation
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── utils/                 # Utilities
│   │   │   ├── jwt.ts
│   │   │   └── response.ts
│   │   ├── prisma/
│   │   │   └── client.ts          # Prisma singleton
│   │   ├── app.ts                 # Express app config
│   │   └── server.ts              # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── providers.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx
│   │   │   └── useTasks.ts
│   │   └── services/
│   │       └── api.ts             # Axios config + interceptors
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — Copy `.env.example` to `.env` and update:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager?schema=public"
ACCESS_TOKEN_SECRET="your-strong-random-secret"
REFRESH_TOKEN_SECRET="your-strong-random-secret"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

**Frontend** — Copy `.env.example` to `.env.local`:
```bash
cd frontend
cp .env.example .env.local
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint          | Description           | Auth |
|--------|-------------------|-----------------------|------|
| POST   | `/auth/register`  | Register new user     | No   |
| POST   | `/auth/login`     | Login user            | No   |
| POST   | `/auth/refresh`   | Refresh access token  | No   |
| POST   | `/auth/logout`    | Logout user           | No   |

### Tasks (All Protected)
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | `/tasks`              | Create task             |
| GET    | `/tasks`              | Get tasks (paginated)   |
| GET    | `/tasks/:id`          | Get single task         |
| PATCH  | `/tasks/:id`          | Update task             |
| DELETE | `/tasks/:id`          | Delete task             |
| PATCH  | `/tasks/:id/toggle`   | Toggle completion       |

**Query Parameters for `GET /tasks`:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `completed` — Filter: `true` or `false`
- `search` — Search title (case-insensitive)

---

## ⭐ Features

- ✅ JWT Authentication (Access + Refresh tokens with rotation)
- ✅ Axios interceptor for automatic token refresh
- ✅ Debounced search input
- ✅ Loading skeleton UI
- ✅ Protected routes (redirect if not authenticated)
- ✅ Clean reusable components
- ✅ Proper modular folder structure
- ✅ Zod input validation
- ✅ Global error handling
- ✅ Toast notifications
- ✅ Mobile responsive design
- ✅ Empty state UI
- ✅ Delete confirmation overlay

---

## 🚢 Deployment

### Backend (Render / Railway)
1. Set environment variables in dashboard
2. Build command: `npm run build`
3. Start command: `npm start`
4. Add Prisma migration to build: `npx prisma migrate deploy && npm run build`

### Frontend (Vercel)
1. Import the `frontend` directory
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
3. Deploy

---

## 📄 License

MIT
