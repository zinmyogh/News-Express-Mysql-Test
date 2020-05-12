module.exports = (options) => {
  const jwt = require("jsonwebtoken");
  const def = require("../config/dbConfig");
  // User = require("../models/User");

  return async (req, res, next) => {
    if (req.url != "/login" && req.url != "/register") {
      console.log("e0");
      //token可能存在post请求和get请求
      let token =
        req.body.authorization ||
        req.query.authorization ||
        req.headers.authorization;
      jwt.verify(token, def.secret, function (err, decode) {
        if (err) {
          console.log("e1");
          res.json({
            message: "没有token",
            code: 201,
          });
        } else {
          console.log("e3");
          next();
        }
      });
    } else {
      console.log("e2");
      next();
    }
  };
};
