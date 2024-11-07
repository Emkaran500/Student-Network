const jwt = require("jsonwebtoken");

const JWT_SECRET = "very_very_very_secret_key";

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log(token);
    if (!token) return res.status(401).json({ message: "Токен отсутствует" });
  
    const tokenValue = token.split(" ")[1];
  
    jwt.verify(tokenValue, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Неверный токен" });
      req.user = user;
      next();
    });
  };

module.exports = authenticateToken;