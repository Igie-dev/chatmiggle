# Chatmiggle

Chatmiggle is a web-based chat application built with Express.js, Socket.io, React, PostgreSQL, Prisma, and Nodemailer.  
The application is designed to provide real-time chat functionality with a robust backend and modern frontend.  
The entire project is containerized using Docker for ease of deployment and management.

# Features

- Real-time messaging
- User authentication and authorization
- User profile management
- Chat rooms and direct messaging
- Email notifications using Nodemailer

# Tech Stack

- **Frontend:** React
- **Backend:** Express.js, Socket.io
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Email Service:** Nodemailer
- **Containerization:** Docker

# Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js and npm installed on your machine
- PostgreSQL installed and running (if not using Docker)

# Installation

git clone [https://github.com/yourusername/chatmiggle.git](https://github.com/Igie-dev/chatmiggle.git)  
cd chatmiggle  
npm install  
docker compose up

# env

**BackEnd**
PORT=  
CLIENT_URL=  
SERVER_URL=  
DATABASE_URL=  
REFRESH_TOKEN_SECRET=  
SYSTEM_EMAIL=  
MAILER_PASSWORD=  
APP_NAME=  
SALTROUND=  
MESSAGES_LIMIT=

**FrontEnd**
VITE_SERVER_URL=  
VITE_SECRET_KEY=  
VITE_MESSAGES_LIMIT=
