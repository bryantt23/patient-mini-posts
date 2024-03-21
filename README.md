# Patient Mini Posts

This project is a mini social platform designed for patients to share and interact with health-related experiences. It utilizes a modern frontend built with Vite, React, and TypeScript, and a backend implemented with Node.js and Express. For development purposes, JSON Server acts as a mock database.

## Getting Started

To run the project on your local machine, follow these steps:

### Prerequisites

- Ensure you have Node.js installed. Download it from the official website if needed: Node.js website: [https://nodejs.org/](https://nodejs.org/)

### Installation

1. Clone this repository:

```sh
git clone https://github.com/bryantt23/patient-mini-posts.git
```

2. Navigate to the project directory:

```sh
cd patient-mini-posts
```

3. Install dependencies for both backend and frontend:

```sh
cd backend
npm install
cd ../frontend
npm install
cd ..
npm install
```

### Running the Application

1. Once dependencies are installed, start the application with this command (from the root of the project):

```sh
npm start
```

This will concurrently launch the backend, JSON-server, and frontend services.

- The backend API will be accessible at http://localhost:3000
- The JSON Server port be accessible at http://localhost:3001
- The frontend will be served by Vite at http://localhost:5173

## Features

* **Interactive health-related posts:** Create text and image posts, like and comment on existing ones.
* **Real-time commenting system:** View comments as they are posted (optional upvote/downvote functionality).
* **Single-page application (SPA):** Experience smooth navigation and performance.
* **Simplified development and deployment:** Leverage the power of Vite and Node.js.

## Technologies

**Frontend:**

* Vite
* React
* TypeScript

**Backend:**

* Node.js
* Express
* JSON Server (for development)
