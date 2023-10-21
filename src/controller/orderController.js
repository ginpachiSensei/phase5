const Joi = require("joi");
const orderModel = require("../models/orderModel.js");

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 * @param {{orderItems:array,shippingAddress:string,totalPrice:string}}: req
 * adds new order in databse with user as reference
 */
const addOrderItems = async (req, res) => {
  const orderItemSchema = Joi.object({
    name: Joi.string().required(),
    qty: Joi.number().required(),
    price: Joi.number().required(),
    product: Joi.string().required(),
  });
  const addOrderItemsSchema = Joi.object({
    orderItems: Joi.array().items(orderItemSchema).min(1).required(),
    shippingAddress: Joi.string().required(),
    totalPrice: Joi.number().required(),
  });

  const { error } = addOrderItemsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ msg: "No order items" });
  } else {
    const order = new orderModel({
      orderItems,
      user: req.user._id,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

/**
 * @desc    Get order by id
 * @route   GET /api/orders/:id
 * @access  Public
 * @param req
 * returns order by the orderid
 */
const getOrderById = async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ msg: "order not found" });
  }
};

/**
 * @desc    Fetch all products for loggedin user
 * @route   GET /api/orders
 * @access  Public
 * @param req
 * returns orders for the current loggedin user with id in cookie
 */
const getMyOrders = async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.json(orders);
};

module.exports = { addOrderItems, getOrderById, getMyOrders };
