# MERN Stack Task Manager (University Project)

A full-stack web application built with the **MERN** stack:
- **M**ongoDB Atlas (via **Mongoose** ODM)
- **E**xpress.js (Node.js REST API)
- **R**eact.js (Frontend UI with Tailwind CSS & TypeScript)
- **N**ode.js (Server runtime)

---

## 🚀 Key Features Fulfilled

1. **Add new tasks**: Includes Title (required), Description (optional), Priority Level, and Due Date.
2. **View all tasks**: Responsive card grid with real-time status badges, relative due dates, and priority indicators.
3. **Edit existing tasks**: Update title, description, priority, due date, and completion status.
4. **Delete tasks**: Safe deletion workflow with interactive confirmation modal.
5. **Set task priority**: **Low**, **Medium**, or **High** with custom color-coded indicators.
6. **Set due dates**: Integrated date picker with quick shortcuts (*Today*, *Tomorrow*, *Next Week*), and overdue highlight flags.
7. **Mark tasks as completed or pending**: One-click checkbox toggle with instant visual strike-through feedback.
8. **Filter & Sort tasks**:
   - Filter by status (**All**, **Pending**, **Completed**)
   - Filter by priority (**All**, **High**, **Medium**, **Low**)
   - Real-time text search for title and description
   - Sorting by Date Created, Due Date, Priority Level, or Alphabetical title

---

## 📁 Project Architecture & Organization

```
├── .env.example              # Environment variables template (MONGODB_URI)
├── server.ts                 # Full-stack entry point: Express server & Vite integration
├── server/
│   ├── db.ts                 # Mongoose connection manager for MongoDB Atlas
│   ├── models/
│   │   └── Task.ts           # Mongoose Task schema with validation & indexes
│   └── routes/
│       └── taskRoutes.ts     # Express REST API routes (/api/tasks, /api/status, etc.)
├── src/
│   ├── types/
│   │   └── task.ts           # TypeScript interfaces for tasks and filters
│   ├── services/
│   │   └── api.ts            # Client-side API service (never exposes DB credentials)
│   ├── components/
│   │   ├── Navbar.tsx        # Top header with MongoDB Atlas indicator & action buttons
│   │   ├── TaskStats.tsx     # Metrics bar (Total, Pending, Completed, High Priority, Overdue)
│   │   ├── TaskFilters.tsx   # Search bar, status buttons, priority pills, and sort selector
│   │   ├── TaskCard.tsx      # Individual task card with toggle, edit, and delete
│   │   ├── TaskFormModal.tsx # Add/Edit task modal dialog
│   │   ├── DeleteConfirmModal.tsx # Delete confirmation dialog
│   │   ├── MongoAtlasModal.tsx    # Live MongoDB Atlas connection tester & setup guide
│   │   ├── VSCodeGuideModal.tsx   # In-app download & local running instructions
│   │   └── Toast.tsx         # Notification feedback toast system
│   ├── App.tsx               # Main application container
│   ├── main.tsx              # React DOM mounting
│   └── index.css             # Tailwind CSS imports
├── index.html                # HTML entry point with metadata
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🔒 Security Best Practices: No Database Credentials in Frontend

In accordance with web security best practices:
- **The frontend never connects directly to MongoDB.**
- The frontend only makes HTTP `fetch` requests to `/api/tasks`.
- All database queries, Mongoose connections, and secrets (`MONGODB_URI`) are strictly confined to the Node.js/Express backend inside `server.ts` and `server/db.ts`.

---

## 💻 How to Download and Run in Visual Studio Code

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [Visual Studio Code](https://code.visualstudio.com/)

### Step 1: Download & Extract
1. In AI Studio, click the **Download / Export Code** icon in the top header to download the project `.zip`.
2. Extract the ZIP file to your computer (e.g. `~/Projects/mern-task-manager`).

### Step 2: Open in VS Code
1. Launch VS Code.
2. Go to `File > Open Folder...` and select your extracted project folder.
3. Open the integrated terminal (`Ctrl + \`` on Windows/Linux or `Cmd + \`` on macOS).

### Step 3: Install Dependencies
In the terminal, run:
```bash
npm install
```

### Step 4: Configure MongoDB Atlas in `.env`
1. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your MongoDB Atlas connection string:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/taskmanager?retryWrites=true&w=majority"
   ```

### Step 5: Start the Full-Stack Application
Run the unified development command:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🌐 Setting Up Free MongoDB Atlas (Beginner Guide)

1. **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create Cluster**: Select **M0 Free Tier** (free forever, no credit card required).
3. **Database User**: Go to **Security > Database Access**, click **Add New Database User**, enter a username (e.g. `admin`) and secure password.
4. **Network Access**: Go to **Security > Network Access**, click **Add IP Address**, and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. **Get URI**: On your Cluster overview, click **Connect > Drivers (Node.js)**, copy the connection string, and replace `<password>` with your password.
6. **Connect**: Paste it into your `.env` or use the in-app **Atlas Setup & Connect** dialog to test live!

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch tasks with optional filters (`status`, `priority`, `search`, `sort`, `order`) |
| `POST` | `/api/tasks` | Create a new task (`title`, `description`, `priority`, `dueDate`, `completed`) |
| `GET` | `/api/tasks/:id` | Fetch a single task by ID |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task completion status |
| `DELETE`| `/api/tasks/:id` | Delete a task |
| `GET` | `/api/status` | Get server status and MongoDB Mongoose connection state |
| `POST`| `/api/connect-mongodb` | Dynamically test and connect to MongoDB Atlas |
| `POST`| `/api/seed-tasks` | Load sample university tasks |
