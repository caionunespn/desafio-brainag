# Desafio Brain AG

## Overview

This README provides instructions on how to run the project using Docker Compose. The API will be accessible at `http://localhost:4005`.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/caionunespn/desafio-brainag
    ```

2. Navigate to the project directory:

    ```bash
    cd desafio-brainag
    ```

3. Create a `.env.development` file in api folder with the variables PORT and DATABASE_URL:

    ```env
    # Example values
    PORT=4005
    DATABASE_URL="postgresql://postgres:postgres@db:5432/brainag_dev?schema=public&connect_timeout=300"
    ```

4. Run or Build the project using Docker Compose:

    ```bash
    docker-compose up (-d) (--build)
    ```

   The API can take a little while to load if its the first time, since its applying the migrations.

5. Access the API's docs at [http://localhost:4005/docs](http://localhost:4005/docs).

## Stopping the Services

To stop the services and remove the containers, run:

```bash
docker-compose down