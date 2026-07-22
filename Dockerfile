FROM node:22-alpine

WORKDIR /app

# Copy root package.json and workspace package.jsons
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend (Vite)
RUN npm run build --workspace=frontend

# Build backend (tsc)
RUN npm run build --workspace=backend

ENV NODE_ENV=production

# Expose backend port
EXPOSE 3001

# Start the backend server
CMD ["npm", "start", "--workspace=backend"]
