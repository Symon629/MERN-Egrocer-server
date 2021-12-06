const Category = require("../models/category");

exports.getAllCategory = async (req, res) => {
  try {
    const categoryList = await Category.find();
    res.status(200).json({
      status: "Success",
      data: {
        categoryList,
      },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      data: { err },
    });
  }
};

exports.postCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json({
      status: "Success",
      data: {
        newCategory,
      },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      data: { err },
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      data: { err },
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const delCatogory = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    res.json({
      status: "Failed",
      data: { err },
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      data: { err },
    });
  }
};
