# Smart Farming Dashboard - Deployment Guide

This guide provides multiple deployment options for the Smart Farming Dashboard, from quick cloud deployments to advanced containerized setups.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Firebase Project**: Create a Firebase project with Realtime Database enabled
- **Firebase Credentials**: 
  - Frontend: Firebase config object (for client-side)
  - Backend: Service account JSON file (for admin access)
- **Node.js 16+** and **Python 3.8+** for local testing

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Fork this repository to your GitHub account
2. Connect your GitHub to [Vercel](https://vercel.com)
3. Import your forked repository
4. Set environment variables in Vercel dashboard:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
5. Deploy! Vercel will automatically build and deploy your frontend.

**Backend on Railway:**
1. Create account on [Railway](https://railway.app)
2. Create new project from GitHub repository
3. Select the `Backend/api` folder as the source
4. Set environment variables:
   ```
   PORT=5000
   FIREBASE_CRED_PATH=/app/firebase-credentials.json
   ```
5. Upload your Firebase service account JSON as `firebase-credentials.json`
6. Deploy!

### Option 2: Netlify (Frontend) + Render (Backend)

**Frontend on Netlify:**
1. Connect GitHub to [Netlify](https://netlify.com)
2. Create new site from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables in Netlify dashboard (same as Vercel above)
5. Deploy!

**Backend on Render:**
1. Create account on [Render](https://render.com)
2. Create new Web Service from Git
3. Settings:
   - Root Directory: `Backend/api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. Set environment variables (same as Railway above)
5. Deploy!

## 🐳 Docker Deployment

### Single Container (Frontend + Backend)

Use the provided `Dockerfile` and `docker-compose.yml`:

```bash
# Clone the repository
git clone https://github.com/PeradheepY/Smart_Farming_Dashboard.git
cd Smart_Farming_Dashboard

# Copy environment template and fill in your values
cp .env.example .env

# Build and run with Docker Compose
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Multi-Container Setup

For production environments, use separate containers:

```bash
# Build frontend
docker build -f Dockerfile.frontend -t smart-farming-frontend .

# Build backend
docker build -f Dockerfile.backend -t smart-farming-backend .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up
```

## ☁️ Cloud Platform Deployments

### AWS Deployment

**Using AWS App Runner:**
1. Upload your code to GitHub
2. Create App Runner service
3. Connect to your repository
4. Configure build settings for both frontend and backend
5. Set environment variables
6. Deploy!

**Using AWS Elastic Beanstalk:**
1. Install AWS CLI and EB CLI
2. Initialize Elastic Beanstalk application
3. Deploy using provided configuration files

### Google Cloud Platform

**Using Cloud Run:**
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Configure environment variables
5. Set up Cloud Build for CI/CD

### Microsoft Azure

**Using Azure Container Instances:**
1. Build Docker images
2. Push to Azure Container Registry
3. Deploy to Container Instances
4. Configure environment variables

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `.env.local` in the root directory:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Backend Environment Variables

Create `.env` in the `Backend/api` directory:

```bash
PORT=5000
FIREBASE_CRED_PATH=./firebase-credentials.json
FLASK_ENV=production
```

### Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Realtime Database

2. **Get Frontend Config:**
   - Go to Project Settings
   - Scroll to "Your apps" section
   - Click "Web app" icon to create web app
   - Copy the config object values

3. **Get Backend Credentials:**
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Use this file for backend authentication

## 🔄 CI/CD Pipeline

### GitHub Actions

The repository includes GitHub Actions workflows for:
- **Frontend**: Builds and deploys to Vercel/Netlify
- **Backend**: Builds and deploys to Railway/Render
- **Docker**: Builds and pushes container images

### Manual Deployment Commands

**Frontend:**
```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
# Upload these files to your static hosting service
```

**Backend:**
```bash
# Navigate to backend directory
cd Backend/api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn (production)
gunicorn app:app --bind 0.0.0.0:5000

# Or run with Flask (development)
python app.py
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update the backend CORS configuration
   - Ensure frontend URL is allowed in backend

2. **Firebase Connection Issues:**
   - Verify environment variables are correctly set
   - Check Firebase project permissions
   - Ensure service account has proper roles

3. **Build Failures:**
   - Check Node.js version (requires 16+)
   - Clear node_modules and reinstall dependencies
   - Verify all environment variables are set

4. **Backend API Not Accessible:**
   - Check if backend service is running
   - Verify port configuration
   - Check firewall/security group settings

### Performance Optimization

1. **Frontend:**
   - Enable gzip compression
   - Configure CDN for static assets
   - Implement service worker for caching

2. **Backend:**
   - Use Redis for caching
   - Configure connection pooling
   - Implement rate limiting

## 📊 Monitoring and Maintenance

### Health Checks

The backend includes health check endpoints:
- `GET /health` - Basic health check
- `GET /api/status` - Detailed system status

### Logging

Configure appropriate logging levels:
- **Development**: DEBUG
- **Production**: INFO or WARNING

### Database Maintenance

- Regular Firebase database backups
- Monitor database usage and costs
- Implement data retention policies

## 🔐 Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to Git
   - Use secure environment variable management
   - Rotate API keys regularly

2. **Firebase Security:**
   - Configure Firebase security rules
   - Limit database access permissions
   - Monitor access logs

3. **Network Security:**
   - Use HTTPS for all communications
   - Implement proper CORS policies
   - Consider API rate limiting

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review the application logs
3. Verify all environment variables are correctly set
4. Test the deployment locally first

For additional help, please open an issue in the repository with:
- Deployment method used
- Error messages or logs
- Environment details (OS, versions, etc.)