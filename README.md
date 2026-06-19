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
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── upstash.js            # Redis rate limiter config
│   │   ├── controllers/
│   │   │   └── newsController.js     # CRUD business logic
│   │   ├── middleware/
│   │   │   └── rateLimiter.js        # Rate limiting middleware
│   │   ├── models/
│   │   │   └── News.js               # News schema (title, content, category, timestamps)
│   │   ├── routes/
│   │   │   └── newsRoutes.js         # API routes
│   │   └── server.js                 # Express entry point (serves frontend in production)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── NewsCard.jsx          # Article card component
│   │   │   ├── NewsNotFound.jsx      # Empty state UI
│   │   │   └── RateLimitedUI.jsx     # Rate limit error UI
│   │   ├── lib/
│   │   │   ├── axios.js              # Axios instance, base URL switches on Vite mode
│   │   │   └── utils.js              # Date formatting utility
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Article feed
│   │   │   ├── CreatePage.jsx        # Article creation form
│   │   │   └── ArticlePage.jsx       # Single article view with inline editing
│   │   ├── App.jsx                   # Main app component + routing
│   │   └── main.jsx                  # React entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
├── package.json                      # Root build/start scripts for deployment
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