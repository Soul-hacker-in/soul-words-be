const query = require("./query");
const bcrypt = require("bcrypt");

async function get_all_data(req, res) {
  try {
    if (!query.data) {
      throw new Error("Query statement is undefined or missing.");
    }

    const get_all_data = query.data;
    console.log("-------------- query:", get_all_data);

    const result = await new Promise((resolve, reject) => {
      connection.query(get_all_data, (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    console.log("Query result:", result);

    res.status(200).json({ status: "success", data: result });
    return { status: "success", data: result };
  } catch (err) {
    console.error("Error in getting data:", err);

    res.status(500).json({ status: "error", message: err.message });
    throw new Error("Error in getting data: " + err.message);
  }
}
async function get_all_category(req, res) {
  try {
    if (!query.category) {
      throw new Error("Query statement is undefined or missing.");
    }

    const get_all_category = query.category;

    const result = await new Promise((resolve, reject) => {
      connection.query(get_all_category, (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    console.log("Query result:", result);

    res.status(200).json({ status: "success", data: result });
    return { status: "success", data: result };
  } catch (err) {
    console.error("Error in getting data:", err);

    res.status(500).json({ status: "error", message: err.message });
    throw new Error("Error in getting data: " + err.message);
  }
}
async function add_new_category(req, res) {
  try {
    const { category } = req.body;

    if (!category) {
      throw new Error("Category is required.");
    }

    const addCategoryQuery = query.addCategory;

    const result = await new Promise((resolve, reject) => {
      connection.query(addCategoryQuery, [category], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    console.log("Category added successfully:", result);

    res.status(200).json({
      status: "success",
      message: "Category added successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error in adding category:", err);

    res.status(500).json({ status: "error", message: err.message });
  }
}
async function add_new_post(req, res) {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category || !Array.isArray(category)) {
      throw new Error(
        "Valid title, description, and category array are required."
      );
    }

    // Step 1: Insert the word (title and description) into the words table
    const addWordQuery = query.addWord;

    const wordResult = await new Promise((resolve, reject) => {
      connection.query(addWordQuery, [title, description], (err, result) => {
        if (err) {
          console.error("Database error while inserting word:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const wordId = wordResult.insertId; // Get the ID of the newly inserted word

    console.log("Word inserted successfully:", wordResult);

    // Step 2: Insert entries into the word_category table for each category
    const categoryValues = category.map((catId) => [wordId, catId]);

    const addCategoryQuery = query.addWordWithCategory;

    const categoryResult = await new Promise((resolve, reject) => {
      connection.query(addCategoryQuery, [categoryValues], (err, result) => {
        if (err) {
          console.error("Database error while inserting categories:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log("Categories inserted successfully:", categoryResult);

    // Step 3: Respond with success
    res.status(200).json({
      status: "success",
      message: "Word and categories added successfully",
      data: {
        wordId,
        categories: categoryResult,
      },
    });
  } catch (err) {
    console.error("Error in adding word or categories:", err);

    // Return error response
    res.status(500).json({ status: "error", message: err.message });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const getUserByEmailQuery = query.getUserByEmail;

    const result = await new Promise((resolve, reject) => {
      connection.query(getUserByEmailQuery, [email], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    if (result.length === 0) {
      throw new Error("User not found.");
    }

    const user = result[0];

    // Compare the plain text password directly
    if (password !== user.password) {
      throw new Error("Invalid password.");
    }

    console.log("User logged in successfully:", user);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: { userId: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Error in login:", err);

    res.status(500).json({ status: "error", message: err.message });
  }
}


module.exports = {
  get_all_data,
  get_all_category,
  add_new_category,
  add_new_post,
  login,
};
