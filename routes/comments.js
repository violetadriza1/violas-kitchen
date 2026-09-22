const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { cleanText } = require('../utils/sanitize');

// POST /recipes/:id/comments — called via fetch() from public/js/comments.js
// Returns JSON so the page can append the new comment without a reload.
router.post('/recipes/:id/comments', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const author_name = cleanText(req.body.author_name, 100);
    const comment_text = cleanText(req.body.comment_text, 1000);

    if (!author_name || !comment_text) {
      return res.status(400).json({ error: 'Name and comment are both required.' });
    }

    const comment = await Comment.create({
      recipe_id: recipe.id,
      author_name,
      comment_text,
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
