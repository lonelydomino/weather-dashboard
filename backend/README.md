# Weather Dashboard Backend

A FastAPI backend for the Weather Dashboard application.

## Setup

1. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```

## API Endpoints

- `GET /` - Health check
- `GET /api/weather/current/{city}` - Current weather
- `GET /api/weather/forecast/{city}` - Weather forecast

## API Documentation

Once running, visit:
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc
