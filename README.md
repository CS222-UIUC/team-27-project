# Turtle Soup Riddle Game

This project is a web-based implementation of the "Turtle Soup" riddle game. Players can solve mysterious puzzles by asking yes/no questions or create their own puzzles to share with others.

---

## Project Overview

The game allows users to:
1. **Play the Turtle Soup game**: Solve riddles by uncovering the hidden story behind a mysterious scenario.
2. **Create custom puzzles**: Design and submit your own puzzles with titles, descriptions, solutions, and tags.

For more details, refer to the project proposal: `Situation Puzzle Game Project Proposal.docx`.

---

## Features

- **Dark Mode Support**: Toggle between light and dark themes for a better user experience.
- **Dynamic Puzzle Management**: Create, tag, and store puzzles in a SQLite database.
- **Interactive Chat Interface**: Ask questions and receive responses from the game master.
- **Responsive Design**: Optimized for desktop browsers (recommended: Chrome).

---

## Setup Instructions

### 1. Install Dependencies

Ensure you have Node.js installed. Then, run the following command in the project directory to install required dependencies:

```bash
npm install
```

### 2. Start the Server

Run the server using the following command:

```bash
npm start
```

The server will start at `http://localhost:3000`.

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the game.

---

## Development Guide

### File Structure

- **`public/`**: Contains static files for the frontend.
  - **`html/`**: HTML files for different pages (e.g., `chat.html`, `create.html`).
  - **`js/`**: JavaScript files for frontend logic (e.g., `main.js`, `chat.js`, `create.js`).
  - **`icon/`**: Icons for UI elements (e.g., theme toggle, home button).
- **`db/`**: SQLite database and related scripts.
- **`server.js`**: Backend server logic using Express.js.

### Key Scripts

- **Frontend**:
  - `main.js`: Handles the homepage logic and navigation.
  - `chat.js`: Manages the chat interface for solving puzzles.
  - `create.js`: Provides functionality for creating and submitting puzzles.
- **Backend**:
  - `server.js`: Handles API routes for fetching and submitting puzzles.
  - `db.js`: Initializes and manages the SQLite database.

---

## Git Workflow

### 1. Initialize Git Repository

Run the following commands to set up the repository:

```bash
git init
git remote add origin https://github.com/CS222-UIUC/team-27-project.git
```

### 2. Pull Latest Changes

Before making changes, pull the latest code:

```bash
git pull origin main
```

### 3. Commit and Push Changes

After making changes, follow these steps:

1. Add changes to the staging area:
    ```bash
    git add .
    ```
2. Commit the changes:
    ```bash
    git commit -m "Your commit message"
    ```
3. Push the changes to the repository:
    ```bash
    git push origin main
    ```

---

## Notes

- **Dark Mode**: The theme preference is saved in `localStorage` and persists across pages.
- **Database**: The SQLite database automatically creates tables for puzzles and tags if they do not exist.
- **API Endpoints**:
  - `POST /api/getReply`: Handles user questions and returns responses.
  - `POST /api/puzzles`: Submits a new puzzle to the database.
  - `GET /api/puzzles`: Fetches puzzles from the database.

---

## Troubleshooting

- **Server Issues**: Ensure all dependencies are installed and the server is running on the correct port.
- **Database Errors**: Check the `db/database.db` file and ensure the database schema is initialized correctly.
- **Frontend Issues**: Use Chrome Developer Tools to debug JavaScript or CSS problems.

---

## Contribution Guidelines

1. Follow the Git workflow mentioned above.
2. Test your changes thoroughly before pushing to the repository.
3. Use consistent coding styles for JavaScript and CSS.

---

## License

This project is licensed under the ISC License.

## Group member
Bo Zhu: Backend, API, Test
Jun Wen: Front end, Database
Shen Rong: Backend, Frontend, Puzzles
Yi Wang: Front end, Database, UI
