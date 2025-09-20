# Use Node.js for building the frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Use Python for the backend and serve frontend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY Backend/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY Backend/api/ ./

# Copy built frontend files
COPY --from=frontend-builder /app/dist ./static

# Create a simple server to serve both frontend and backend
COPY <<EOF serve.py
import os
from flask import Flask, send_from_directory, send_file
from app import app as api_app

# Import the existing Flask app
app = api_app

# Serve static files (frontend)
@app.route('/')
def serve_frontend():
    return send_file('static/index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path.startswith('api/'):
        # Let the existing API routes handle API calls
        return api_app(path)
    
    # Check if it's a static file
    if os.path.exists(f'static/{path}'):
        return send_from_directory('static', path)
    else:
        # For client-side routing, serve index.html
        return send_file('static/index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
EOF

# Expose port
EXPOSE 8080

# Set environment variables
ENV FLASK_ENV=production
ENV PORT=8080

# Run the application
CMD ["python", "serve.py"]