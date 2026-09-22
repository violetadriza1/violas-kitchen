const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Recipe = require('../models/Recipe');
const requireAdmin = require('../middleware/requireAdmin');
const { cleanText } = require('../utils/sanitize');

// --- Auth ---

router.get('/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const validUsername = username === process.env.ADMIN_USERNAME;
    const validPassword =
      validUsername &&
      process.env.ADMIN_PASSWORD_HASH &&
      (await bcrypt.compare(password || '', process.env.ADMIN_PASSWORD_HASH));

    if (!validUsername || !validPassword) {
      return res.status(401).render('admin/login', { error: 'Incorrect username or password.' });
    }

    req.session.isAdmin = true;
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// --- Dashboard (Read) ---

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.render('admin/dashboard', { recipes });
  } catch (err) {
    next(err);
  }
});

// --- Create ---

router.get('/recipes/new', requireAdmin, (req, res) => {
  res.render('admin/recipe-form', {
    mode: 'new',
    recipe: null,
    categories: Recipe.CATEGORIES,
    error: null,
  });
});

router.post('/recipes', requireAdmin, async (req, res, next) => {
  try {
    const data = extractRecipeData(req.body);
    const error = validateRecipeData(data);
    if (error) {
      return res.status(400).render('admin/recipe-form', {
        mode: 'new',
        recipe: data,
        categories: Recipe.CATEGORIES,
        error,
      });
    }
    const id = await Recipe.create(data);
    res.redirect(`/recipes/${id}`);
  } catch (err) {
    next(err);
  }
});

// --- Update ---

router.get('/recipes/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).render('404', { message: 'Recipe not found' });
    res.render('admin/recipe-form', {
      mode: 'edit',
      recipe,
      categories: Recipe.CATEGORIES,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/recipes/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).render('404', { message: 'Recipe not found' });

    const data = extractRecipeData(req.body);
    const error = validateRecipeData(data);
    if (error) {
      return res.status(400).render('admin/recipe-form', {
        mode: 'edit',
        recipe: { ...data, id: recipe.id },
        categories: Recipe.CATEGORIES,
        error,
      });
    }
    await Recipe.update(req.params.id, data);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// --- Delete ---

router.post('/recipes/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    await Recipe.delete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

// --- Helpers ---

function extractRecipeData(body) {
  return {
    title: cleanText(body.title, 150),
    category: cleanText(body.category, 50),
    ingredients: cleanText(body.ingredients, 3000),
    instructions: cleanText(body.instructions, 4000),
    prep_time: cleanText(body.prep_time, 30),
    image_url: cleanText(body.image_url, 255),
  };
}

function validateRecipeData(data) {
  if (!data.title || !data.category || !data.ingredients || !data.instructions || !data.prep_time) {
    return 'Please fill in title, category, ingredients, instructions and prep time.';
  }
  if (!Recipe.CATEGORIES.includes(data.category)) {
    return 'Please choose a valid category.';
  }
  return null;
}

module.exports = router;
