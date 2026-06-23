# ─── Base stage shared by dev and prod ───────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ─── Development stage ───────────────────────────────────────────────────────
FROM base AS development
RUN npm install              # installs devDependencies too (nodemon)
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]

# ─── Production stage ────────────────────────────────────────────────────────
FROM base AS production
RUN npm install --omit=dev   # skip devDependencies in prod
COPY . .
EXPOSE 5001
CMD ["node", "src/server.js"]
# ─────────────────────────────────────────────────────────────────────────────