const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "images/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router
  .route("/")
  .get(productController.getAllProduct)
  .post(uploadOptions.single("image"), productController.createProduct);

router.get(`/filter`, productController.getFilterProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(uploadOptions.single("image"), productController.updateProduct)
  .delete(productController.deleteProduct);

router.get("/get/count", productController.getProductCount);
router.get("/get/featured/:count", productController.getFeaturedProducts);

router.put(
  "/gallery-image/:id",
  uploadOptions.array("image", 10),
  productController.uploadMultipleImages
);

module.exports = router;
