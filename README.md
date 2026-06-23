# kbNews

A full-stack news platform for creating, reading, updating, and deleting articles with rate-limiting protection and responsive design.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-13AA52?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

## 🌐 Live Demo

**[https://kbnews.onrender.com](https://kbnews.onrender.com)**

## 📸 Screenshot

![kbNews Screenshot](docs/Screenshot.png)

## ✨ Features

- **Complete CRUD Operations** — Create, read, update, and delete news articles with an intuitive interface
- **Rate Limiting** — Redis-backed sliding window rate limiter (100 requests per 60 seconds) to protect the API
- **Responsive Design** — Mobile-first UI built with Tailwind CSS and DaisyUI components
- **Newest-First Feed** — Articles sorted by creation date with no manual refresh required
- **Clean Architecture** — MVC pattern on the backend with clear separation of concerns
- **REST API** — Fully RESTful backend with consistent error handling and HTTP status codes
- **Environment-Based Configuration** — Automatic API base URL switching between local development and production

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, Vite, React Router DOM, Tailwind CSS, DaisyUI, Axios, react-hot-toast, lucide-react |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Rate Limiting** | Upstash Redis with @upstash/ratelimit |
| **Deployment** | Render (single web service) |
| **Build Tool** | Vite |

## 📁 Project Structure

```
kbNews/
├── docker-compose.dev.yml           # Dev compose config (frontend + backend)
├── docker-compose.prod.yml          # Production compose config
├── backend/
│   ├── Dockerfile                   # Backend container definition
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── db.js                 # MongoDB connection
│       │   ├── cloudinary.js         # Cloudinary upload config
│       │   ├── nodemailer.js         # Mailer config
│       │   └── upstash.js            # Redis rate limiter config
│       ├── controllers/
│       │   ├── authController.js     # Auth logic (signup, login, verify)
│       │   └── newsController.js     # CRUD business logic
│       ├── middleware/
│       │   ├── rateLimiter.js        # Rate limiting middleware
│       │   ├── upload.js             # File upload middleware
│       │   └── verifyToken.js        # JWT verification middleware
│       ├── models/
│       │   ├── News.js               # News schema
│       │   └── User.js               # User schema
│       ├── routes/
│       │   ├── authRoutes.js         # Auth API routes
│       │   └── newsRoutes.js         # News API routes
│       └── server.js                 # Express entry point (serves frontend in production)
├── frontend/
│   ├── Dockerfile                   # Frontend container (build + optional nginx)
│   ├── package.json
│   ├── index.html
│   ├── nginx.conf                    # Nginx config used in production container
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── NewsCard.jsx
│       │   ├── NewsNotFound.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RateLimitedUI.jsx
│       │   └── SearchBar.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useInfiniteScroll.js
│       ├── lib/
│       │   ├── axios.js
│       │   └── utils.js
│       └── pages/
│           ├── ArticlePage.jsx
│           ├── CreatePage.jsx
│           ├── ForgotPasswordPage.jsx
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── ResetPasswordPage.jsx
│           ├── SignupPage.jsx
│           └── VerifyEmailPage.jsx
├── docs/
│   └── Screenshot.png
├── package.json                      # Root build/start scripts and Docker helpers
└── README.md
```

## 📡 API Reference

All endpoints are prefixed with `/api/news` and protected by rate-limiting middleware. Requests exceeding the limit (100 per 60 seconds) receive a `429 Too Many Requests` response.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news` | Retrieve all articles, sorted newest first |
| `GET` | `/api/news/:id` | Retrieve a single article by ID |
| `POST` | `/api/news` | Create a new article (title and content required; category optional) |
| `PUT` | `/api/news/:id` | Update an existing article |
| `DELETE` | `/api/news/:id` | Delete an article |

**Request Body Example (POST/PUT):**
```json
{
  "title": "Article Title",
  "content": "Article content goes here...",
  "category": "Technology"
}
```

**Response Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Article Title",
  "content": "Article content goes here...",
  "category": "Technology",
  "createdAt": "2026-06-19T10:30:00.000Z",
  "updatedAt": "2026-06-19T10:30:00.000Z"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account and connection string
- Upstash Redis account (free tier available)
- Git

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KaranGB83/kbNews.git
   cd kbNews
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Create a `.env` file in the `backend/` directory:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kbNews?retryWrites=true&w=majority
   UPSTASH_REDIS_REST_URL=https://your-region-rest.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_rest_token_here
   NODE_ENV=development
   PORT=5001
   ```

   > No `.env` file is needed in `frontend/` — the API base URL switches automatically between `http://localhost:5001/api` (dev) and `/api` (production) based on Vite's build mode.

5. **Start the development servers:**

   *Backend (from `backend/` directory):*
   ```bash
   npm run dev
   ```

   *Frontend (from `frontend/` directory, in a separate terminal):*
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5001/api/news`

### Docker (recommended)

The project is fully dockerized for both development and production using `docker-compose`.

1. **Build and run (development):**
```bash
# from repository root
docker compose -f docker-compose.dev.yml up --build
```

2. **Build and run (production):**
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

3. **Stop and remove containers:**
```bash
docker compose -f docker-compose.dev.yml down
```

Notes:
- Ensure your backend environment variables are available to the containers. You can place them in `backend/.env` or configure a Docker secrets/ENV file referenced by the compose files.
- The production compose uses the `frontend` build served by `nginx` (see `frontend/nginx.conf`) and the `backend` image to run Express.

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/kbNews?retryWrites=true&w=majority` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint | `https://us1-quick-deer.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token | `AZiu...` |
| `NODE_ENV` | Execution environment | `development` or `production` |
| `PORT` | Backend server port | `5001` |

## 🌍 Deployment

This application is deployed on **Render** as a single web service:

1. **Build Command:** `npm run build` — installs backend and frontend dependencies, then builds the React app to a static bundle (devDependencies are explicitly included so Vite is available during the build step)
2. **Start Command:** `npm start` — runs the Express server, which serves the built frontend as static files in production
3. **Environment Variables:** All backend variables are configured in Render's dashboard, with `NODE_ENV=production`
4. **Live URL:** https://kbnews.onrender.com

The Express server checks `NODE_ENV === "production"` and serves the frontend build from `frontend/dist/`, with a catch-all route returning `index.html` so React Router can handle client-side routing — eliminating the need for separate frontend and backend deployments.

## 💡 What I Learned

- **ESM Import Order with dotenv** — In an ES Modules backend, `import` statements are hoisted, so `dotenv` has to be loaded as a side-effect import (`import "dotenv/config"`) before any other module reads `process.env`, otherwise config values like the database URI come through as `undefined`.
- **`NODE_ENV` and Deployment Installs** — Setting `NODE_ENV=production` on Render affects `npm install` itself, not just runtime logic — it skips devDependencies by default, which broke the frontend build since `vite` is a devDependency. Fixed by explicitly forcing `--include=dev` on the frontend install step while keeping `NODE_ENV=production` for the running app.
- **Redis-Based Rate Limiting** — Implemented a sliding window rate limiter with Upstash Redis to protect API endpoints without maintaining in-memory server state, including a "fail open" fallback so the API stays usable if Redis is temporarily unreachable.
- **Scalable Backend Architecture** — Structured the Express backend around config/controllers/middleware/models/routes, making it straightforward to extend with authentication, pagination, or logging without touching unrelated files.

## 🔮 Future Improvements

- **User Authentication** — JWT-based auth to track article authors and restrict edit/delete permissions to the original author
- **Image Uploads** — Cover images for articles via Cloudinary or similar
- **Search & Pagination** — Full-text search and paginated feeds for better UX at scale
- **Rich Text Editor** — Replace the plain textarea with a rich text editor (Quill or Tiptap)
- **Comments & Reactions** — Reader engagement features
- **Analytics Dashboard** — Track article views and popular categories

## 👤 Author

**Karan Bhatre**
- GitHub: [@KaranGB83](https://github.com/KaranGB83)
- LinkedIn: [karan-bhatre](https://linkedin.com/in/karan-bhatre-912634322/)

---

*Built as a learning project to demonstrate full-stack MERN development and clean code architecture.*