# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace package.jsons
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies (workspaces will be linked)
RUN npm install

# Copy source code
COPY . .

# Build frontend (Vite)
RUN npm run build --workspace=frontend

# Build backend (tsc)
RUN npm run build --workspace=backend

# Stage 2: Production Server
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/

# Expose backend port (this should match your PORT env var)
EXPOSE 3001

# Start the backend server which also serves the frontend statics
CMD ["npm", "start", "--workspace=backend"]
