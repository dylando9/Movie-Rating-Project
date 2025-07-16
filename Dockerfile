# Python base image
FROM python:3.10

# Set working directory inside container
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend code (including app.py and recommender.py)
COPY backend/ ./

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Run app.py using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
