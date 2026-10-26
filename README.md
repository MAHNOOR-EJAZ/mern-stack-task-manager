# MERN Stack Task Manager

A full-stack task management application built using MongoDB Atlas, Express.js, React, and Node.js (MERN), with TypeScript and Tailwind CSS.

## Key Features

- Create tasks with a title, description, priority, and due date.
- View tasks in a responsive dashboard.
- Edit and delete existing tasks.
- Mark tasks as completed or pending.
- Filter tasks by status and priority.
- Search tasks by title and description.
- Sort tasks by creation date, due date, priority, or title.
- View task statistics and overdue indicators.
- Check MongoDB connection status.

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Build tool:** Vite

## Project Structure

```text
mern-stack-task-manager/
├── server.ts
├── server/
│   ├── db.ts
│   ├── models/
│   │   └── Task.ts
│   └── routes/
│       └── taskRoutes.ts
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The exact structure may vary slightly depending on the files in your local project.

## Prerequisites

- Node.js and npm
- Visual Studio Code
- A MongoDB Atlas account and configured database

## Setup and Installation

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a local `.env` file using `.env.example` as a template.
5. Add your own MongoDB Atlas connection string to `.env`. Never commit real credentials to GitHub.
6. Start the application:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000` in your browser if that is the port configured by your server.

## Security

- The frontend communicates with the backend through HTTP API endpoints.
- Database operations should be handled by the backend.
- Keep `.env`, API keys, database passwords, and other secrets out of version control.
- Configure MongoDB Atlas network access according to your security requirements.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Fetch