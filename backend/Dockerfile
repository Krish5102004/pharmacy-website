# Package used to execute app
FROM python:3.11-slim

# Working Directory Location
WORKDIR /app

# Install python dependencies and copy requirements to working directory
RUN pip install --no-cache-dir --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire things to working directory
COPY . .

# Running on port 5000
EXPOSE 5000

# Execute command after build the environment in this case Run flask 
CMD ["python","app.py"]
