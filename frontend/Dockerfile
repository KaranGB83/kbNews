# ─── Base stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ─── Development stage ───────────────────────────────────────────────────────
FROM base AS development
RUN npm install              # installs devDependencies (vite, tailwind, etc.)
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
# --host exposes Vite dev server outside the container so your browser can reach it

# ─── Build stage (intermediate — not the final prod image) ───────────────────
FROM base AS builder
RUN npm install --include=dev   # needs vite to build
COPY . .
RUN npm run build               # outputs to /app/dist

# ─── Production stage (serves built files via nginx) ─────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# ─────────────────────────────────────────────────────────────────────────────