const query = {
  data: `SELECT * FROM words.words;`,
  category: `SELECT * FROM words.categories;`,
  addCategory: `INSERT INTO words.categories (name) VALUES (?)`,
  addWord: "INSERT INTO words (title, content) VALUES (?, ?)",
  addWordWithCategory:
    "INSERT INTO word_category (word_id, category_id) VALUES ?",
  getUserByEmail: "SELECT * FROM user WHERE email = ?",
};

module.exports = query;
