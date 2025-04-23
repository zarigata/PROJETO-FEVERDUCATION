# CODEX: Dockerfile for frontend service
# Enhanced to ensure all style files are properly included
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Ensure all style directories exist and copy CSS files
RUN mkdir -p public/styles/presets \
    && mkdir -p public/styles/components \
    && cp -r src/styles/presets/* public/styles/presets/ \
    && cp -r src/styles/animations.css public/styles/ \
    && cp -r src/styles/components.css public/styles/

# Build the React app
RUN npm run build

# Serve via nginx
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a healthcheck to verify the service is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
