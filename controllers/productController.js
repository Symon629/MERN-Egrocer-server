const Product = require("../models/products");
const Category = require("../models/category");
const router = require("../routers/products");
const multer = require("multer");

exports.getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        err,
      },
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        status: "failed",
        data: "There's no such category",
      });
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/images/uploads/`;
    const product = await Product.create({
      image: `${basePath}${fileName}`,
      ...req.body,
    });
    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        err,
      },
    });
  }
};

exports.getFilterProduct = async (req, res) => {
  const product = await Product.find().select("name image -_id");
  res.status(200).json({
    status: "Success",
    data: {
      product,
    },
  });
};

exports.getProduct = async (req, res) => {
  let filter = {};
  const product = await Product.findById(req.params.id).populate("category");
  res.status(200).json({
    status: "Success",
    data: {
      product,
    },
  });
};

exports.updateProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        status: "failed",
        data: "There's no such category",
      });
    const file = req.file;
    let imagepath;
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/images/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { image: imagepath, ...req.body },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        err,
      },
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  res.status(200).json({
    status: "Success",
    data: {
      product,
    },
  });
};

exports.getProductCount = async (req, res) => {
  const productCount = await Product.countDocuments();
  res.status(200).json({
    status: "Success",
    data: {
      productCount,
    },
  });
};
exports.getFeaturedProducts = async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    res.status(200).json({
      status: "Success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: {
        err,
      },
    });
  }
};
exports.uploadMultipleImages = async (req, res) => {
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/images/uploads/`;
  const files = req.files;
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.fileName}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images: imagesPaths },
    { new: true }
  );
};
