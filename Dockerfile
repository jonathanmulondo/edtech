FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PostgreSQL and other build tools
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

# Use the PORT environment variable that Render provides
CMD sh -c "uvicorn Spider:app --host 0.0.0.0 --port ${PORT:-8000}"
