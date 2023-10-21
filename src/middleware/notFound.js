const notFound = (req, res) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
};

module.exports = notFound;
