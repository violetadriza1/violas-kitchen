const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

// GET / — recipe index, optionally filtered by category
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const recipes = await Recipe.findAll(category);
    res.render('index', {
      recipes,
      categories: Recipe.CATEGORIES,
      activeCategory: category || null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /recipes/:id — recipe detail page + comments
router.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).render('404', { message: 'Recipe not found' });
    }
    const comments = await Comment.findByRecipeId(recipe.id);
    res.render('recipe-detail', { recipe, comments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
