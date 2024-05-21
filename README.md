# Docker Compose Setup for Local Development

This repository contains a Docker Compose setup for local development with DynamoDB, a backend service, and a frontend service.

## Prerequisites

- Docker
- Docker Compose

## Services

### 1. DynamoDB

- **Image**: amazon/dynamodb-local
- **Port**: 8000
- **Volume**: ./docker/dynamodb:/home/dynamodblocal/data

### 2. Backend

- **Image**: backend
- **Port**: 8080
- **Environment Variables**: Refer to ./backend/.env
- **Dependencies**: Depends on DynamoDB service

### 3. Frontend

- **Image**: frontend
- **Port**: 3000
- **Environment Variables**: Refer to ./frontend/.env
- **Dependencies**: Depends on Backend service

## Usage

1. Clone this repository:

    ```bash
    git clone https://github.com/ar-rehman135/min-trello-kanban
    ```

2. Navigate to the repository directory:

    ```bash
    cd your-repo
    ```

3. Start the services using Docker Compose:

    ```bash
    docker-compose up
    ```

4. Access the frontend application in your browser at `http://localhost:3000`.

## Notes

- Ensure that Docker and Docker Compose are properly installed on your system before running the services.
- Make sure to configure environment variables in `.env` files for backend and frontend accordingly.

