# Viola's Kitchen

A single-admin cooking blog built for the course *Project: Getting Started in Web Programming (DLBITPEWP01_E)*.

The admin publishes recipes across five categories (Air Fryer, Desserts, Breakfast, Instant Pot, Dinner). Visitors browse recipes by category and leave comments under each recipe — no visitor registration required.

## Tech Stack

- **Frontend:** HTML5, CSS3, EJS templates, vanilla JavaScript (Fetch API for async comments)
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via `mysql2`)
- **Auth/session:** `express-session`, `bcrypt`
- **Tooling:** `nodemon`, `dotenv`, Git

## Project Structure

```
violas-kitchen/
├── config/         # DB connection, environment setup
├── routes/         # Express route handlers
├── views/          # EJS templates
├── public/         # CSS, client-side JS, images
├── models/         # DB queries / data access
├── .env.example    # Sample environment variables (copy to .env)
├── .gitignore
├── app.js          # Express app entry point
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/violetadriza1/violas-kitchen.git
   cd violas-kitchen
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your own values:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=violas_kitchen
   SESSION_SECRET=change_me
   ADMIN_PASSWORD_HASH=
   ```
4. Create the database and tables (see `schema.sql`, to be added during the development phase).
5. Start the development server:
   ```
   npm run dev
   ```
6. Visit `http://localhost:3000` in your browser.

## Data Model

- **recipes** — id, title, category, ingredients, instructions, prep_time, image_url, created_at, author
- **comments** — id, recipe_id (FK → recipes.id), author_name, comment_text, created_at

## Status

🚧 Conception phase — project structure and concept document complete. Development starts next phase.

## Author

Violeta Driza
