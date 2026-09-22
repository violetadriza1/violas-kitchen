require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const recipesRouter = require('./routes/recipes');
const commentsRouter = require('./routes/comments');
const adminRouter = require('./routes/admin');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // parse HTML form submissions
app.use(express.json());                          // parse JSON (used by the AJAX comment form)
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
  })
);

// Make the current year available to all views (footer copyright, etc.)
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Routes
app.use('/', recipesRouter);
app.use('/', commentsRouter);
app.use('/admin', adminRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Viola's Kitchen running at http://localhost:${PORT}`);
});
