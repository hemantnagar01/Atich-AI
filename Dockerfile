# Stage 1: Build
FROM node:22-alpine AS builder

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
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy everything from builder to ensure npm workspaces and node_modules are intact
COPY --from=builder /app ./

# Expose backend port
EXPOSE 3001

# Start the backend server
CMD ["npm", "start", "--workspace=backend"]
