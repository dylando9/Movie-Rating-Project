# Use Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file from backend and install dependencies
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend source code into the container
COPY backend/ .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py

# Expose the port that Gunicorn will run on
EXPOSE 5000

# Run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
