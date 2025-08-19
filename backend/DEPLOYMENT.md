# 🚀 Deploy Backend to Render

## 📋 Prerequisites
- GitHub account
- Render account (free)
- Weather API key from [weatherapi.com](https://weatherapi.com)

## 🎯 Step-by-Step Deployment

### 1. Push Backend to GitHub
```bash
# Create a new repo for backend (recommended)
# OR push to existing weather-dashboard repo in a backend/ folder
git add .
git commit -m "🚀 Prepare backend for Render deployment"
git push origin main
```

### 2. Deploy to Render

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repo**
4. **Configure the service:**
   - **Name**: `weather-dashboard-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`

### 3. Set Environment Variables

In Render dashboard, go to **Environment** tab and add:
- **Key**: `WEATHER_API_KEY`
- **Value**: Your actual weather API key

### 4. Deploy!

Click **"Create Web Service"** and wait for deployment!

## 🔗 Update Frontend

Once deployed, update your frontend to use the new backend URL:

```typescript
// In your frontend, change from:
const response = await fetch(`http://localhost:8000/api/weather/current/${city}`);

// To:
const response = await fetch(`https://your-render-app.onrender.com/api/weather/current/${city}`);
```

## 🌟 Benefits of Render

- ✅ **Free tier available**
- ✅ **Auto-deploys on GitHub push**
- ✅ **Automatic HTTPS**
- ✅ **Custom domains**
- ✅ **Great for Python/FastAPI**

## 🚨 Important Notes

- **Free tier**: 750 hours/month (usually covers full month)
- **Cold starts**: First request after inactivity may be slow
- **Environment variables**: Must be set manually in Render dashboard
- **CORS**: Already configured to allow Vercel domains

## 🧪 Test Your Deployment

Visit your Render URL to see the API docs:
`https://your-app.onrender.com/docs`

You should see the FastAPI interactive documentation!
