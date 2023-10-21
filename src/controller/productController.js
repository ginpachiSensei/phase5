const Joi = require("joi");
const productModel = require("../models/productModel");

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Public
 * @param {query {page:int, limit:int}}: req
 * this route requires pagination requires page number to passed in query
 */
const getProducts = async (req, res) => {
  //schema for req object used for pagination of the request
  const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  });

  try {
    const { error } = paginationSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Pagination parameters (page and limit)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the skip value to skip the correct number of documents
    const skip = (page - 1) * limit;

    // Query the database to retrieve products with pagination
    const products = await productModel.find().skip(skip).limit(limit);

    // Count total products (for pagination info)
    const totalProducts = await productModel.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Fetch product by given id
 * @route   GET /api/products/:id
 * @access  Public
 * @param {{params:id}}: req
 * this route requires pagination requires page number to passed in query
 */
const getProductById = async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ msg: "Product not found" });
  }
};

/**
 * @desc    create new product
 * @route   POST /api/products/
 * @access  Private/admin
 * @param {{name:string,description:string,price:int,countInStock:int}}: req
 * this route is used to create product with product object can be done by only admin
 */
const createProduct = async (req, res) => {
  const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().integer().required(),
    countInStock: Joi.number().integer().required(),
  });

  const { error } = createProductSchema.validate(req.query);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const product = new productModel({
    user: req.user._id,
    name: req.name,
    description: req.description,
    price: 0,
    countInStock: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

/**
 * @desc    update a product
 * @route   PUT /api/products/:id
 * @access  Private/admin
 * @param {{name:string,description:string,price:int,countInStock:int}}: req
 * route to update product can be done by admin only
 */
const updateProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (product) {
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.countInStock = req.body.countInStock;

    const updatedProduct = await product.save();

    res.status(201).json(updatedProduct);
  } else {
    res.status(404).json({ msg: "Product not found" });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct };
