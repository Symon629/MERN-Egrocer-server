const Orders = require("../models/order");
const OrderItem = require("../models/order-item");


exports.postOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Orders({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};
exports.getOrders = async (req, res) => {
  const orders = await Orders.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  res.status(200).json({
    status: "Success",
    data: {
      orders,
    },
  });
};
exports.getOrder = async (req, res) => {
  const order = await Orders.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  res.status(200).json({
    status: "Success",
    data: {
      order,
    },
  });
};
exports.updateOrder = async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "Success",
    data: {
      order,
    },
  });
};

exports.deleteOrder = async (req, res) => {
  const order = await Orders.findByIdAndRemove(req.params.id, {
    new: true,
  });
  const orderItem = await order.orderItems.map(
    async (orderItem) => await OrderItem.findByIdAndRemove(orderItem)
  );
  res.status(200).json({
    status: "Success",
    data: "orders is succesfully deleted",
  });
};

exports.totalSales = async (req, res) => {
  const totalSales = await Orders.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  res.status(200).json({
    status: "Success",
    data: {
      totalSales,
    },
  });
};

exports.getOrderHistory = async (req, res) => {
  const userOrderList = await Orders.find({
    user: req.params.userid,
  })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  res.status(200).json({
    status: "Success",
    data: {
      userOrderList,
    },
  });
};
