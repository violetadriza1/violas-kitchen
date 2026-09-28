# Viola's Kitchen

A single-admin cooking blog built for the course *Project: Getting Started in Web Programming (DLBITPEWP01_E)*. The admin publishes recipes in five categories (Air Fryer, Desserts, Breakfast, Instant Pot, Dinner). Visitors browse and filter recipes, read the full ingredients and steps, and leave comments that appear instantly, with no page reload. There is no visitor registration.

**Status:** Phase 3 (finalization). The application is complete and working: public browsing, category filtering, recipe pages with live comments, and full admin CRUD.

## Features

**Public site**

* Recipe index with category filters (for example `/?category=Desserts`)
* Recipe page with photo, ingredients, numbered steps, prep time and author
* Comments posted with the Fetch API (no page reload), each shown with a timestamp
* Friendly empty states: no comments yet, no recipes in a category, no recipes at all

**Admin (single account, session login)**

* Dashboard listing every recipe
* Create, edit and delete recipes (full CRUD)
* Input trimmed and length-limited on the server

**Quality and security**

* All output is escaped by EJS; live comments are inserted with `textContent`, never `innerHTML`
* SQL uses placeholders, never string concatenation
* The admin password is stored only as a bcrypt hash, and admin routes are guarded by session middleware
* Responsive layout for phones and desktops

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, EJS templates, vanilla JavaScript (Fetch API), Google Fonts (Playfair Display, Inter) |
| Backend | Node.js, Express 5 |
| Database | MySQL (mysql2 driver with a connection pool) |
| Auth | express-session, bcrypt |
| Tooling | Git and GitHub, nodemon, dotenv |

## Prerequisites

* Node.js 18 or newer, with npm
* MySQL 8 or newer, running locally (also verified with MariaDB 10.11)

## Setup

**1. Get the code and install dependencies**

~~~
git clone https://github.com/violetadriza1/violas-kitchen.git
cd violas-kitchen
npm install
~~~

**2. Create and seed the database**

~~~
mysql -u root < schema.sql
~~~

If your MySQL root user has a password, use `mysql -u root -p < schema.sql` instead. This creates the `violas_kitchen` database and the `recipes` and `comments` tables, and seeds six recipes, each with its photo. Running it again drops both tables and restores the seed data.

**3. Configure the environment**

~~~
cp .env.example .env
~~~

Open `.env` and set:

* `DB_PASSWORD`: your MySQL root password, or leave it empty if there is none
* `SESSION_SECRET`: any long random string
* `ADMIN_PASSWORD_HASH`: generate it with the command below and paste the whole output after the equals sign (it starts with `$2b$`)

~~~
node scripts/hash-password.js "kitchen2026"
~~~

**4. Start the server**

~~~
npm run dev
~~~

`npm run dev` restarts automatically when code changes (nodemon). Use `npm start` for a plain start. Then open http://localhost:3000.

## Admin login

* URL: http://localhost:3000/admin/login
* Username: `violeta` (the `ADMIN_USERNAME` value in `.env`)
* Password: `kitchen2026` (the password hashed in step 3; these are demo credentials for local evaluation, so replace them for any real use)

The `.env` file is not committed, and only the bcrypt hash of the password is ever stored.

## Adding a recipe

Log in, open the dashboard, click **+ New Recipe**, fill in the title, category, prep time, optional image URL, ingredients (one per line) and instructions (one step per line), then click **Publish Recipe**. Use **Edit** and **Delete** on the dashboard to change or remove a recipe.

## How recipe photos work

* The six recipe photos are AI-generated images. I created them with AI image tools (ChatGPT for five of them, Gemini for the sweet potato fries) and then resized and compressed them for the web. They are illustrative images, not photographs.
* Photos are ordinary files in `public/images/`. Express serves everything in `public/` as static files, so `public/images/pancakes.jpg` is available in the browser at `/images/pancakes.jpg`.
* Each recipe stores that path in its `image_url` column. `schema.sql` seeds the six recipes with their paths (`/images/chicken-wings.jpg`, `/images/lava-cake.jpg`, `/images/pancakes.jpg`, `/images/beef-stew.jpg`, `/images/chicken-thighs.jpg`, `/images/sweet-potato-fries.jpg`).
* To give a new recipe a photo, copy the file into `public/images/` and enter `/images/your-file.jpg` in the **Image URL** field, or paste a full `https://` address. If the field is left empty, a placeholder plate icon is shown.
* Uploading a photo directly from the admin form is not implemented.

## Project structure

~~~
violas-kitchen/
  app.js                  Express app: middleware, sessions, routes
  schema.sql              Database schema and seed data (six recipes with photos)
  .env.example            Template for local configuration (copy to .env)
  config/db.js            MySQL connection pool
  models/                 Recipe.js and Comment.js (all SQL lives here)
  routes/                 recipes.js (public), comments.js (AJAX), admin.js (login and CRUD)
  middleware/             requireAdmin.js (session guard)
  utils/sanitize.js       Trims and length-limits input
  views/                  EJS templates (partials/ and admin/)
  public/                 css/, js/comments.js, images/ (recipe photos)
  scripts/                hash-password.js (creates the bcrypt hash)
  docs/                   Phase 1 proposal (PDF), architecture diagram, wireframes
~~~

## Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/` | public | Recipe index, optional `?category=` filter |
| GET | `/recipes/:id` | public | Recipe page with comments |
| POST | `/recipes/:id/comments` | public | Add a comment (JSON in, JSON out, used by Fetch) |
| GET, POST | `/admin/login` | public | Admin login |
| POST | `/admin/logout` | admin | Log out |
| GET | `/admin` | admin | Dashboard |
| GET, POST | `/admin/recipes/new`, `/admin/recipes` | admin | Create a recipe |
| GET, POST | `/admin/recipes/:id/edit` | admin | Edit a recipe |
| POST | `/admin/recipes/:id/delete` | admin | Delete a recipe |

## Data model

* `recipes`: id, title, category, ingredients, instructions, prep_time, image_url, author, created_at
* `comments`: id, recipe_id (foreign key to `recipes.id`, `ON DELETE CASCADE`), author_name, comment_text, created_at

Ingredients and instructions are stored as plain text, one item per line, and split into list items when a page is rendered. The architecture diagram and the wireframes are in `docs/`.

## Troubleshooting

* **Cannot connect to the local MySQL server**: start MySQL first. On macOS with Homebrew, run `brew services start mysql`.
* **npm warns that bcrypt has install scripts**: run `npm install-scripts approve bcrypt`, then `npm install` again (only newer versions of npm show this warning).
* **Cannot log in**: check that `ADMIN_PASSWORD_HASH` in `.env` is the complete hash starting with `$2b$`, and restart the server after editing `.env`.
* **Port 3000 is already in use**: add a line such as `PORT=3001` to `.env`.

## Author

Violeta Driza, IU Internationale Hochschule, course DLBITPEWP01_E.
