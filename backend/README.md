# MGCLUB Backend API

Built with NestJS, Prisma, and PostgreSQL.

## Prerequisites

1.  **PostgreSQL Database**: You need a running Postgres instance.
2.  **Node.js**: v18+ recommended.

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Configure Database**:
    Create a `.env` file in the `backend/` directory:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mgclub_db?schema=public"
    JWT_SECRET="super-secret"
    ```

3.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Server**:
    ```bash
    npm run start:dev
    ```

## API Documentation

Once running, visit:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

to see the Swagger UI and test endpoints.

## Features Implemented

- **Auth**: JWT Login with device binding simulation.
- **Booking**: Smart capacity checks (Waiting List logic).
- **Gym**: Live traffic updates via Socket.io and REST.
