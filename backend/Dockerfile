# Use a base Python image
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Set environment variable to avoid bytecode
ENV PYTHONDONTWRITEBYTECODE 1

# Set environment variable for Flask
ENV FLASK_APP=app.py

# Run the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
