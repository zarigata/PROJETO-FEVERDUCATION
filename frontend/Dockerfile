# CODEX: Dockerfile for frontend service
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Copy CSS presets
RUN mkdir -p public/styles/presets && cp -r src/styles/presets/* public/styles/presets/

# Build the React app
RUN npm run build

# Serve via nginx
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
