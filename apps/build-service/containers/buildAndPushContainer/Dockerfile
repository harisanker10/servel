# Dockerfile
FROM alpine:latest

# Install Git
RUN apk add --no-cache git
RUN apk add --no-cache docker

WORKDIR /app

# Copy the build script into the container
COPY ./script.sh .

# Make the script executable
RUN chmod +x /app/script.sh

RUN ls

CMD ["/app/script.sh"]
