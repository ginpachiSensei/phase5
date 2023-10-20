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

module.exports = { getProducts };
