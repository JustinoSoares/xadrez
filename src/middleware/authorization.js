require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: false,
      msg: "Acesso negado",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        status: false,
        msg: "Acesso negado",
      });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message,
    });
  }
};

module.exports = authorization;