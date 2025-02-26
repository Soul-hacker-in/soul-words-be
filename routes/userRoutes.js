const express = require("express");
const {
  get_all_data,
  get_all_category,
  add_new_category,
  add_new_post,
  login,
} = require("../model");
const router = express.Router();

router.get("/get_all_data", async (req, res) => {
  await get_all_data(req, res);
});
router.get("/get_all_category", async (req, res) => {
  await get_all_category(req, res);
});
router.post("/add_new_category", async (req, res) => {
  await add_new_category(req, res);
});
router.post("/add_new_post", async (req, res) => {
  await add_new_post(req, res);
});
router.post("/login", async (req, res) => {
  await login(req, res);
});

module.exports = router;
