FROM node:20-alpine
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and build/run
COPY . .
EXPOSE 5050
CMD ["npm", "run", "start"]
