const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  try {
    const userList = await User.find();
    res.status(200).json({
      status: "Success",
      data: {
        userList,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "Failed",
      data: {
        err,
      },
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "Failed",
      data: {
        err,
      },
    });
  }
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.JWTSECRET;
  if (!user) {
    return res.status(400).send("The user not found");
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        user: user.email,
        token: token,
      },
    });
  } else {
    res.status(400).send("password is wrong");
  }
};

exports.getUserCount = async (req, res) => {
  const userCount = await User.countDocuments();
  res.status(200).json({
    status: "Success",
    data: {
      userCount,
    },
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
};


