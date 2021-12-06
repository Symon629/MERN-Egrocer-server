const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(categoryController.postCategory);
router.delete("/:id", categoryController.deleteCategory);

router.get("/:id", categoryController.getCategory);
router.put("/:id", categoryController.updateCategory);

module.exports = router;
