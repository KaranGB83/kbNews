# kbNews

A full-stack news platform for creating, reading, updating, and deleting articles with rate-limiting protection and responsive design.

## Tech Stack Badges

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
- **Real-time Updates** — Instant article feed sorted by newest first with no page refresh required
- **Clean Architecture** — MVC pattern on backend with clear separation of concerns
- **REST API** — Fully RESTful backend with consistent error handling and HTTP status codes
- **Environment-Based Configuration** — Seamless switching between local development and production deployments

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
│   │   └── server.js                 # Express entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── NewsCard.jsx          # Article card component
│   │   │   ├── NewsNotFound.jsx      # 404 fallback
│   │   │   └── RateLimitedUI.jsx     # Rate limit error UI
│   │   ├── lib/
│   │   │   ├── axios.js              # Axios instance with env-based URLs
│   │   │   └── utils.js              # Date formatting utilities
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Article feed
│   │   │   ├── CreatePage.jsx        # Article creation form
│   │   │   └── ArticlePage.jsx       # Single article view with inline editing
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── App.css, index.css        # Styling
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── package.json
├── package.json                      # Root workspace config
└── README.md
```

## 📡 API Reference

All endpoints are prefixed with `/api/news` and protected by rate-limiting middleware. Requests exceeding the limit (100 per 60 seconds) receive a `429 Too Many Requests` response.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news` | Retrieve all articles sorted by newest first |
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
   git clone https://github.com/yourusername/kbNews.git
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
   PORT=5000
   ```

5. **Create a `.env` file in the `frontend/` directory:**
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

6. **Start the development servers:**

   *Backend (from `backend/` directory):*
   ```bash
   npm run dev
   ```

   *Frontend (from `frontend/` directory in a new terminal):*
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/news`

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/kbNews?retryWrites=true&w=majority` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint | `https://us1-quick-deer.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token | `AZiuASQpODk4NzY1NDMyMWE4NDc4NGI4ZjhkN...` |
| `NODE_ENV` | Execution environment | `development` or `production` |
| `PORT` | Backend server port | `5000` |
| `VITE_API_BASE_URL` | Frontend API endpoint (frontend .env) | `http://localhost:5000` |

## 🌍 Deployment

This application is deployed on **Render** as a single web service. The deployment architecture:

1. **Build Command:** Installs dependencies for both backend and frontend, then builds the React app to a static bundle
2. **Start Command:** Runs the Express server, which serves the built frontend as static files in production
3. **Environment Variables:** All backend `.env` variables are configured in Render's dashboard
4. **Live URL:** https://kbnews.onrender.com

The Express server detects `NODE_ENV=production` and serves the frontend build from the `frontend/dist/` directory, eliminating the need for separate frontend and backend deployments.

## 💡 What I Learned

- **ESM Import Timing with dotenv** — Managing the order of ES module imports to ensure environment variables load before they're referenced, especially in a monorepo structure
- **NODE_ENV and Deployment Dependencies** — Understanding how `NODE_ENV=production` affects npm's installation behavior and build optimization; avoiding devDependencies in production while keeping necessary build tools available during the build phase
- **Redis-Based Rate Limiting** — Implementing a sliding window rate limiter with Upstash Redis to protect API endpoints without maintaining server state; handling 429 responses gracefully on the frontend
- **Scalable Backend Architecture** — Building an Express MVC structure that separates controllers, middleware, routes, and models; making it simple to add features (authentication, pagination, logging) without refactoring core files

## 🔮 Future Improvements

- **User Authentication** — Add JWT-based authentication to track article authors and restrict edit/delete permissions
- **Image Uploads** — Integrate image upload functionality with a CDN or cloud storage service
- **Search & Pagination** — Implement full-text search and paginated article feeds for better UX at scale
- **Rich Text Editor** — Replace textarea with a rich text editor (e.g., Quill or Tiptap) for better content formatting
- **Comments & Reactions** — Add user comments and like/dislike functionality to increase engagement
- **Analytics Dashboard** — Track article views, popular categories, and user engagement metrics

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**  
- GitHub: [@KaranGB83](https://github.com/KaranGB83)
- LinkedIn: [karan-bhatre](https://linkedin.com/in/karan-bhatre-912634322/)

---

*Built as a learning project to demonstrate full-stack MERN development and clean code architecture.*
