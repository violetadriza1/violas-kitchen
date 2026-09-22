// Data access for the "recipes" table.
const pool = require('../config/db');

const CATEGORIES = ['Air Fryer', 'Desserts', 'Breakfast', 'Instant Pot', 'Dinner'];

const Recipe = {
  CATEGORIES,

  // Get all recipes, optionally filtered by category, newest first.
  async findAll(category) {
    if (category && CATEGORIES.includes(category)) {
      const [rows] = await pool.query(
        'SELECT * FROM recipes WHERE category = ? ORDER BY created_at DESC',
        [category]
      );
      return rows;
    }
    const [rows] = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ title, category, ingredients, instructions, prep_time, image_url, author }) {
    const [result] = await pool.query(
      `INSERT INTO recipes (title, category, ingredients, instructions, prep_time, image_url, author)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, category, ingredients, instructions, prep_time, image_url || null, author || 'Violeta Driza']
    );
    return result.insertId;
  },

  async update(id, { title, category, ingredients, instructions, prep_time, image_url }) {
    await pool.query(
      `UPDATE recipes
       SET title = ?, category = ?, ingredients = ?, instructions = ?, prep_time = ?, image_url = ?
       WHERE id = ?`,
      [title, category, ingredients, instructions, prep_time, image_url || null, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
  },
};

module.exports = Recipe;
