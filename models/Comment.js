// Data access for the "comments" table.
const pool = require('../config/db');

const Comment = {
  async findByRecipeId(recipeId) {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE recipe_id = ? ORDER BY created_at ASC',
      [recipeId]
    );
    return rows;
  },

  async create({ recipe_id, author_name, comment_text }) {
    const [result] = await pool.query(
      'INSERT INTO comments (recipe_id, author_name, comment_text) VALUES (?, ?, ?)',
      [recipe_id, author_name, comment_text]
    );
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
    return rows[0];
  },
};

module.exports = Comment;
