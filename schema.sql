-- Viola's Kitchen — database schema and seed data
-- Run this against a fresh MySQL database, e.g.:
--   mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS violas_kitchen
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE violas_kitchen;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150)  NOT NULL,
  category      VARCHAR(50)   NOT NULL,
  ingredients   TEXT          NOT NULL,   -- one ingredient per line
  instructions  TEXT          NOT NULL,   -- one step per line
  prep_time     VARCHAR(30)   NOT NULL,
  image_url     VARCHAR(255)  DEFAULT NULL,
  author        VARCHAR(100)  NOT NULL DEFAULT 'Violeta Driza',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE comments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id     INT NOT NULL,
  author_name   VARCHAR(100) NOT NULL,
  comment_text  TEXT NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data: one recipe per category (matches the concept document)

INSERT INTO recipes (title, category, ingredients, instructions, prep_time, image_url, author) VALUES
(
  'Crispy Air Fryer Chicken Wings',
  'Air Fryer',
  '1 kg chicken wings\n1 tbsp baking powder\n1 tsp salt\n1 tsp smoked paprika\n1/2 tsp garlic powder\n1/2 tsp black pepper',
  'Pat the wings completely dry with paper towels.\nToss wings with baking powder, salt, paprika, garlic powder and pepper.\nArrange in a single layer in the air fryer basket.\nAir fry at 200°C for 12 minutes.\nFlip and cook a further 10-12 minutes until golden and crisp.\nRest for 2 minutes before serving.',
  '25 min',
  NULL,
  'Violeta Driza'
),
(
  'Dark Chocolate Lava Cake',
  'Desserts',
  '100 g dark chocolate\n100 g unsalted butter\n2 large eggs\n2 egg yolks\n50 g sugar\n2 tbsp flour\nPinch of salt',
  'Preheat oven to 200°C and butter two ramekins.\nMelt chocolate and butter together until smooth.\nWhisk eggs, egg yolks and sugar until pale and thick.\nFold in the melted chocolate mixture.\nSift in flour and salt, fold gently until just combined.\nDivide between ramekins and bake for 10-12 minutes until the edges are set but the centre is soft.\nRest 1 minute, then turn out and serve immediately.',
  '25 min',
  NULL,
  'Violeta Driza'
),
(
  'Fluffy Buttermilk Pancakes',
  'Breakfast',
  '250 g flour\n2 tbsp sugar\n2 tsp baking powder\n1/2 tsp baking soda\n1/2 tsp salt\n500 ml buttermilk\n2 eggs\n50 g melted butter',
  'Whisk together flour, sugar, baking powder, baking soda and salt.\nIn a separate bowl, whisk buttermilk, eggs and melted butter.\nPour the wet ingredients into the dry and stir until just combined (a few lumps are fine).\nHeat a non-stick pan over medium heat and lightly grease.\nPour 1/4 cup of batter per pancake; cook until bubbles form on top, then flip.\nCook the other side until golden. Serve warm with your favorite toppings.',
  '20 min',
  NULL,
  'Violeta Driza'
),
(
  'Instant Pot Beef Stew',
  'Instant Pot',
  '1 kg beef chuck, cubed\n2 tbsp oil\n1 onion, diced\n3 carrots, sliced\n3 potatoes, cubed\n3 cloves garlic, minced\n500 ml beef stock\n2 tbsp tomato paste\n1 tsp thyme\nSalt and pepper to taste',
  'Set Instant Pot to Sauté; brown the beef in oil in batches, then set aside.\nSauté the onion and garlic until fragrant.\nStir in tomato paste and cook 1 minute.\nReturn beef to the pot; add carrots, potatoes, stock, thyme, salt and pepper.\nSeal the lid and cook on Manual/Pressure Cook for 35 minutes.\nAllow a natural release for 10 minutes, then quick release the rest.\nStir and adjust seasoning before serving.',
  '45 min',
  NULL,
  'Violeta Driza'
),
(
  'Za''atar Roasted Chicken Thighs',
  'Dinner',
  '8 chicken thighs, bone-in\n3 tbsp olive oil\n3 tbsp za''atar\n2 cloves garlic, minced\n1 lemon, sliced\nSalt to taste',
  'Preheat oven to 220°C.\nPat chicken thighs dry and place in a roasting dish.\nMix olive oil, za''atar, garlic and salt; rub all over the chicken.\nTuck lemon slices between the thighs.\nRoast for 35-40 minutes until the skin is crisp and juices run clear.\nRest 5 minutes before serving.',
  '50 min',
  NULL,
  'Violeta Driza'
),
(
  'Air Fryer Sweet Potato Fries',
  'Air Fryer',
  '2 large sweet potatoes, cut into fries\n1 tbsp olive oil\n1 tsp smoked paprika\n1/2 tsp garlic powder\nSalt to taste',
  'Toss sweet potato fries with olive oil, paprika, garlic powder and salt.\nArrange in a single layer in the air fryer basket (work in batches if needed).\nAir fry at 200°C for 8 minutes.\nShake the basket and cook a further 6-8 minutes until crisp.\nServe hot.',
  '18 min',
  NULL,
  'Violeta Driza'
);
