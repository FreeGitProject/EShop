const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const OrderMailer = require("../utils/orderMailer");
const orderMailer = new OrderMailer();
// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      // Construct the HTML email message
      const orderId = orders[0]._id; // Assuming you want to use the first order ID
      const subTotalPrice = orders[0].cart.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
      );

      // Calculate shipping cost (assuming it's 10% of the subtotal)
      const shipping = subTotalPrice * 0.1;

      const orderItemsHTML = orders[0].cart
        .map(
          (item) => `
    <tr>
        <td>${item.name}</td>
        <td>x${item.qty}</td>
        ${item.size ? `<td>${item.size}</td>` : "<td>-</td>"}
        ${item.color ? `<td>${item.color}</td>` : "<td>-</td>"}
        <td><del>$${item.originalPrice}</del> $${item.discountPrice}</td>
    </tr>
`
        )
        .join("");

      const paymentDetailsHTML = `
    <tr>
        <td colspan="4"><strong>Shipping Charge: $${shipping.toFixed(
          2
        )}</strong></td>
    </tr>
    <tr>
        <td colspan="4"><strong>Total Payment: $${totalPrice}</strong></td>
    </tr>
    <tr>
        <td colspan="3">Payment Type: ${paymentInfo.type}</td>
        ${
          paymentInfo.status
            ? `<td>Status: ${paymentInfo.status}</td>`
            : "<td>Status:-</td>"
        }
    </tr>
`;

      const billingAddressHTML = `
    <tr>
        <td><strong>Billing Address</strong></td>
        <td><strong>Shipping Address</strong></td>
    </tr>
    <tr>
        <td>${shippingAddress.address1}, ${shippingAddress.address2}, ${shippingAddress.zipCode}</td>
        <td>${user.addresses[0].address1}, ${user.addresses[0].address2}, ${user.addresses[0].zipCode}</td>
    </tr>
`;

      const emailSubject = "Your E-Shop order has been received!";
      const emailHTML = `
    <p>Hello ${user.name},</p>
    <p>Just to let you know — we've received your order #${orderId}, and it is now being processed:</p>
    <strong>Order Summary:</strong>
    <table border="1" cellpadding="5">
        <tr>
            <td>Name</td>
            <td>QTY</td>
            <td>Size</td>
            <td>Color</td>
            <td>Price</td>
        </tr>
        ${orderItemsHTML}
        ${paymentDetailsHTML}
        ${billingAddressHTML}
    </table>
`;

      // Send the email
      await orderMailer.sendOrderConfirmation({
        email: user.email,
        subject: emailSubject,
        html: emailHTML,
      });

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
