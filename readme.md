# Todo App Service

A web application for managing a task list, deployed on a cloud infrastructure.

## Features
* **Backend**: Node.js using the Express framework
* **Database**: Cloud-based MongoDB Atlas (Mongoose ORM)
* **Frontend**: Vanilla JavaScript, HTML5, and CSS3
* **Deployment**: AWS EC2 (Amazon Linux 2023) managed by the PM2 process manager

## User Guide

### 1. Adding a Task
* Enter the task text in the input field at the top.
* Click the **"Lisää"** (Add) button.
* If the field is empty, the button will be disabled.

### 2. Editing a Task
* Click the **"[Muokkaa]"** (Edit) link next to the desired task.
* The task text will move to the input field at the top.
* Edit the text and click the **"Tallenna"** (Save) button that appears.

### 3. Deleting a Task
* Click the red **"[x]"** icon to the right of the task text.
* The task will be deleted from the database and removed from the list.

---

## Technical Reference for Maintenance

### Environment Variables
The following variables are required for the server to operate:
* `MONGO_URL`: Connection string for MongoDB Atlas.
* `PORT`: The port the server listens on (default is 8080 for AWS).

### Process Management on EC2
```bash
# View application status
pm2 status

# Restart after code updates
pm2 restart todo-server

# View real-time logs
pm2 logs todo-server
```

## API Endpoints
* GET /todos — fetch all tasks.
* POST /todos — create a new task.
* PUT /todos/:id — update a task by ID.
* DELETE /todos/:id — delete a task.    


## Deployment on Render.com

1. **Create a Web Service**: Link your GitHub repository to Render.
2. **Configure Settings**:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node index.js`
3. **Environment Variables**: Navigate to the **Environment** tab and add the required keys (`MONGO_URL`, `PORT`).

## Local Environment Configuration

To manage your configuration locally, create a `.env` file in the `backend` directory. This file is already ignored by Git to keep your credentials secure.

**Required variables:**
```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=8080
```
The server will prioritize these variables during startup.