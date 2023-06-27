const queryParser = (req, res, next) => {
  req.query.limit = parseInt(req.query.limit) || 5;
  req.query.skip = parseInt(req.query.skip) || 0;
  req.query.comLimit = parseInt(req.query.comLimit) || 5;
  next();
};

module.exports = queryParser;
