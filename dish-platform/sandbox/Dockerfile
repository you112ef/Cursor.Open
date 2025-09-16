FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    g++ \
    make \
    git \
    curl \
    bash

# Install Python packages
RUN pip3 install --no-cache-dir \
    requests \
    numpy \
    pandas

# Install Node.js packages globally
RUN npm install -g \
    typescript \
    ts-node \
    @types/node

# Create sandbox user
RUN adduser -D -s /bin/bash sandbox

# Set up sandbox directory
WORKDIR /sandbox
RUN chown -R sandbox:sandbox /sandbox

# Switch to sandbox user
USER sandbox

# Set up environment
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 3002

# Start sandbox server
CMD ["node", "server.js"]