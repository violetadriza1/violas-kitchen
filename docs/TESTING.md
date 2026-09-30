# Testing Notes

Manual testing performed during the finalization phase: a clean setup from a fresh clone, core functionality, security, responsive layout and cross-browser behaviour.

## Fresh install and setup

Cloned the repository into a separate folder, kept fully independent from the working copy, and followed the README setup steps exactly with no manual patching:

- `npm install`, approving install scripts for `bcrypt` and `fsevents` when prompted
- `mysql -u root < schema.sql` to create and seed the database
- Copied `.env.example` to `.env`, generated the admin password hash with `scripts/hash-password.js`, and added it to `.env`
- Started with `npm run dev`

Result: all six recipes loaded with their photos, posting a comment worked and showed a correctly formatted timestamp, and admin login with the generated credentials worked, showing every recipe on the dashboard. No manual fixes were needed beyond the documented steps.

## Security

Submitted a comment with:

- Name: `<b>Test</b>`
- Comment: `<script>alert("hi")</script>`

Result: both fields rendered as literal text (visible angle brackets, no bold styling, no alert triggered), both immediately after posting and after a full page reload. This confirms output escaping works on both the client-rendered path (Fetch API, DOM) and the server-rendered path (EJS).

## Empty states

- A recipe with no comments (`/recipes/4`) shows "No comments yet. Be the first to share your thoughts!"
- A category with no recipes (`/?category=Dinner`, after removing its only recipe) shows "No Dinner recipes yet. Check back soon, or browse all recipes." with a working link back to the full list

## Responsive layout

Checked in Chrome's device toolbar at iPhone 16 (393 x 852) and at 320px wide (the smallest common phone width):

- Home page: recipe cards keep equal margins on both sides, no horizontal overflow
- Recipe detail page: title, ingredients/instructions and the comment form all fit the screen width
- Admin dashboard: the recipe table scrolls horizontally within its own bordered box; the page itself does not scroll sideways
- Edit recipe form: all fields fit the screen width with no overflow

## Cross-browser (Safari)

Repeated the core flows in Safari on macOS:

- Home page: typography, colours and category filtering match Chrome
- Recipe page: posting a comment works and shows the same timestamp format as Chrome
- Admin: created a test recipe, viewed it on its public page (correctly showing the empty-comment state), and deleted it via Safari's native confirmation dialog

No visual or functional differences from Chrome were found.

## Known limitation

The fresh-clone test copy and the main development copy point at the same local `violas_kitchen` database (same `DB_NAME` in `.env`), so comments posted through one are visible through the other. This is expected shared database state, not a bug in either copy. Running `mysql -u root < schema.sql` resets the database to its seeded state at any time.
