# Backend for Home Repair Service App

This repository contains the backend for the **Home Repair Service App**, a service-oriented platform where users can book services, and providers can manage their services. It is built with **Node.js**, **Express**, and **MongoDB** for efficient server-side operations and data management.

## 🚀 Live Site
Frontend: [https://homere-paire.web.app](https://homere-paire.web.app)  
  &&  
[https://homere-paire.web.app](https://homere-paire.web.app)  
---

## 📦 Features

### Authentication
- **JWT Authentication** for secure user request.
- Token management using HTTP-only cookies.

### Service Management
- Add, update, delete, and view services.
- Restricted service management based on user roles (providers and customers).

### Booking System
- Customers can book services.
- Providers can view and update the status of booked services.

### Search & Filter
- Services can be searched using a filter by service name.

---

## 🛠️ Tech Stack
- **Backend Framework:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Environment Management:** dotenv
- **Middleware:** cors, cookie-parser

---

---
# Dependencies
##This project uses the following dependencies:

```bash
"dependencies": {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.11.0"
  }

```
---

## Follow these steps to set up and run the project locally.

---

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas for remote)

---

### Installation

#### 1. Clone or Download the Repository

Clone this repository using Git:

```bash
git clone

# 2. Install Dependencies
# Navigate to server folders, and run the following command to install required dependencies:

cd server
npm i

# 3. Configure Environment Variables
# Create a .env file in the root directory of the project. This file will store sensitive information like MongoDB credentials. Add the following configuration:

MONGODB_USERNAME=<your-username>
MONGODB_PASSWORD=<your-password>
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@cluster.mongodb.net/<database-name>?retryWrites=true&w=majority
PORT=5000

⚠️ Important Notes:

# Replace <your-username> and <your-password> with your MongoDB credentials.
# Replace <database-name> with your MongoDB database name.

# 4. Start the Backend
# Navigate to the server folder and start the backend server using the following commands:

cd server
yarn start
```


