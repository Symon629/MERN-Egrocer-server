const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router
  .route("/")
  .post(orderController.postOrder)
  .get(orderController.getOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.get("/get/totalSales", orderController.totalSales);

module.exports = router;
