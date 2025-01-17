# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (Flask default is 5000)
EXPOSE 5000

# Set environment variables for Groclake API key and account ID
ENV GROCLAKE_API_KEY=65b9eea6e1cc6bb9f0cd2a47751a186f
ENV GROCLAKE_ACCOUNT_ID=3ddb1f07de092e40e54278fb4a779285

# Command to run the Flask app
CMD ["python", "model.py"]
