from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Weather Dashboard API",
    description="A simple weather API for the weather dashboard",
    version="1.0.0"
)

# Add CORS middleware - allow both localhost and Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://weather-dashboard-nine-beta.vercel.app",  # User's actual Vercel domain
        "https://weather-dashboard-*.vercel.app",  # Vercel preview deployments
        "https://*.vercel.app",  # Any Vercel domain (for safety)
        "*"  # Allow all origins for now (can be restricted later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Weather API configuration
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "demo_key")
WEATHER_BASE_URL = "http://api.weatherapi.com/v1"

@app.get("/test-api")
async def test_weather_api():
    """Test endpoint to check if Weather API is working"""
    try:
        print(f"Testing Weather API with key: {WEATHER_API_KEY[:10]}..." if WEATHER_API_KEY and len(WEATHER_API_KEY) > 10 else f"Testing Weather API with key: {WEATHER_API_KEY}")
        
        async with httpx.AsyncClient() as client:
            # Test with a simple city
            response = await client.get(
                f"{WEATHER_BASE_URL}/current.json",
                params={
                    "key": WEATHER_API_KEY,
                    "q": "London",
                    "aqi": "no"
                },
                timeout=10.0
            )
            
            print(f"Test API Response Status: {response.status_code}")
            print(f"Test API Response: {response.text[:200]}...")
            
            if response.status_code == 200:
                return {
                    "status": "success",
                    "message": "Weather API is working",
                    "api_key_status": "valid",
                    "test_response": response.json()
                }
            else:
                return {
                    "status": "error",
                    "message": "Weather API returned error",
                    "api_key_status": "invalid or expired",
                    "status_code": response.status_code,
                    "response": response.text
                }
                
    except Exception as e:
        print(f"Test API Exception: {str(e)}")
        return {
            "status": "error",
            "message": f"Exception occurred: {str(e)}",
            "api_key_status": "unknown"
        }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Weather Dashboard API is running!",
        "status": "healthy",
        "endpoints": [
            "/docs - API documentation",
            "/api/weather/current/{city} - Current weather",
            "/api/weather/forecast/{city} - Weather forecast"
        ]
    }

@app.get("/api/weather/current/{city}")
async def get_current_weather(city: str):
    """Get current weather for a city or coordinates"""
    try:
        # Check if the input looks like coordinates (contains comma and numbers)
        if ',' in city and any(char.isdigit() for char in city):
            # This is coordinates, use them directly
            query = city
        else:
            # This is a city name, use as is
            query = city
            
        # Debug logging
        print(f"API Key: {WEATHER_API_KEY[:10]}..." if WEATHER_API_KEY and len(WEATHER_API_KEY) > 10 else f"API Key: {WEATHER_API_KEY}")
        print(f"Query: {query}")
        print(f"Full URL: {WEATHER_BASE_URL}/current.json")
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{WEATHER_BASE_URL}/current.json",
                params={
                    "key": WEATHER_API_KEY,
                    "q": query,
                    "aqi": "no"
                },
                timeout=10.0
            )
            
            print(f"Weather API Response Status: {response.status_code}")
            print(f"Weather API Response: {response.text[:200]}...")
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "city": data["location"]["name"],
                    "country": data["location"]["country"],
                    "region": data["location"]["region"],
                    "coordinates": {
                        "lat": data["location"]["lat"],
                        "lon": data["location"]["lon"]
                    },
                    "current": {
                        "temperature_c": data["current"]["temp_c"],
                        "temperature_f": data["current"]["temp_f"],
                        "condition": data["current"]["condition"]["text"],
                        "icon": data["current"]["condition"]["icon"],
                        "humidity": data["current"]["humidity"],
                        "wind_kph": data["current"]["wind_kph"],
                        "wind_direction": data["current"]["wind_degree"],
                        "pressure_mb": data["current"]["pressure_mb"],
                        "uv": data["current"]["uv"],
                        "feels_like_c": data["current"]["feelslike_c"],
                        "feels_like_f": data["current"]["feelslike_f"]
                    },
                    "last_updated": data["current"]["last_updated"]
                }
            else:
                print(f"Weather API Error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=400, 
                    detail=f"Weather data not available for {city}. API Response: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout")
    except Exception as e:
        print(f"Exception in get_current_weather: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@app.get("/api/weather/forecast/{city}")
async def get_forecast(city: str, days: int = 7):
    """Get weather forecast for a city or coordinates"""
    if days < 1 or days > 14:
        days = 7
    
    try:
        # Check if the input looks like coordinates (contains comma and numbers)
        if ',' in city and any(char.isdigit() for char in city):
            # This is coordinates, use them directly
            query = city
        else:
            # This is a city name, use as is
            query = city
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{WEATHER_BASE_URL}/forecast.json",
                params={
                    "key": WEATHER_API_KEY,
                    "q": query,
                    "days": days,
                    "aqi": "no"
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                forecast_data = []
                
                for day in data["forecast"]["forecastday"]:
                    forecast_data.append({
                        "date": day["date"],
                        "max_temp_c": day["day"]["maxtemp_c"],
                        "min_temp_c": day["day"]["mintemp_c"],
                        "max_temp_f": day["day"]["maxtemp_f"],
                        "min_temp_f": day["day"]["mintemp_f"],
                        "condition": day["day"]["condition"]["text"],
                        "icon": day["day"]["condition"]["icon"],
                        "precipitation_mm": day["day"]["totalprecip_mm"],
                        "max_wind_kph": day["day"]["maxwind_kph"],
                        "uv": day["day"]["uv"],
                        "sunrise": day["astro"]["sunrise"],
                        "sunset": day["astro"]["sunset"]
                    })
                
                return {
                    "city": data["location"]["name"],
                    "country": data["location"]["country"],
                    "forecast": forecast_data
                }
            else:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Forecast not available for {city}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Use environment variable for port (Render requirement)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
