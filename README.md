# 🍫 Chocadies Recruitment Platform

A full-stack recruitment application for managing job applications, built with **Django REST Framework (MongoDB)** and **Ionic Vue**.

## 🏗 System Architecture

- **Backend:** Django 6+, Django REST Framework, SimpleJWT (Auth)
- **Database:** MongoDB (using `django-mongodb-backend`)
- **Frontend:** Ionic 8 + Vue 3 (Composition API), Pinia Store
- **Security:** JWT Authentication (Access/Refresh Tokens) + Secure Storage (Mobile)

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed:

1.  **Python 3.10+**
2.  **Node.js 16+** & **npm**
3.  **MongoDB Server** (Running locally or via Atlas)
    - Create a database named: **`chocadies_db`**

---

## 🚀 Backend Setup (Django)

### 1. Configure the Environment

Set up a virtual environment.

```bash
# Create Virtual Environment
python -m venv venv
# Activate (Mac/Linux)
source venv/bin/activate
# Activate (Windows)
.\venv\Scripts\activate
```

### 2. Install Dependencies & Apply MongoDB Patch

First, install the required packages:

```Bash
pip install -r requirements.txt
```

### 3. Ensure MongoDB is running, then apply migration to create database names `chocadies_db`.

if `MongoDB` is not installed you can download the mongo GUI from [MongoDB Compass Download (GUI)](https://www.mongodb.com/try/download/compass)

or

```Bash
brew update
brew install mongodb-community@7.0
brew services start mongodb/brew/mongodb-community
mongosh #Verify MongoDB is Running
use chocadies_db # create the db
```

```Bash
python manage.py migrate
```

### 4. Create HR Admin User

Create a superuser to access the dashboard.

```Bash
python manage.py createsuperuser
Follow the prompts to set a Username, Email, and Password.
```

### 5. Run the Server

```Bash
python manage.py runserver
The API will be available at: http://127.0.0.1:8000/
```

### 📚 API Documentation & Tools:

Swagger UI: `http://127.0.0.1:8000/api/docs/`

OpenAPI Schema: `http://127.0.0.1:8000/api/schema/`

Admin Panel: `http://127.0.0.1:8000/admin/`

## 📱 Frontend Setup (Ionic Vue)

### 1. Install Dependencies

Open a new terminal window and navigate to the client folder.

```Bash
cd client
npm install
```

### 2. Configure API URL

By default, the app connects to localhost. If needed, update the .env file (create one if it doesn't exist):

```js
VITE_API_URL = "http://127.0.0.1:8000/api/";
```

### 3. Run the App (Web Mode)

To start the local development server:

```Bash
ionic serve
The app will launch at: http://localhost:8100/
```

🔑 Key Features & Usage

### 1. Public Application Form

- Go to http://localhost:8100/apply

- Candidates can submit details and upload a Resume (PDF).

- Validation: Checks for duplicate emails and required files.

### 2. HR Dashboard (Protected)

- Go to http://localhost:8100/login

- Log in with the Superuser credentials you created.

- Dashboard: View all applicants.

- Detail View: Click an applicant to view their cover letter, download resume, or update status.

### 3. Authentication Flow

- Login: Returns Access (1h) and Refresh (24h) tokens.

Storage: Tokens are stored in SecureStorage (Mobile) or localStorage (Web fallback).

- Logout: Blacklists the Refresh token on the server (MongoDB) and clears local storage.
