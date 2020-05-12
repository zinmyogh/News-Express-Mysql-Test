const dbConfig = require("../config/dbConfig");

getUser = (req, res) => {
  var sql = "select * from test";
  var sqlArr = [];
  var callback = (err, data) => {
    if (err) {
      console.log("error in controller");
    } else {
      res.send({ data });
    }
  };
  dbConfig.sqlConnect(sql, sqlArr, callback);
};

getPost = (req, res) => {
  let { id } = req.query;
  var sql = "select * from test where id = ?";
  var sqlArr = [id];
  var callback = (err, data) => {
    if (err) {
      console.log("error in controller");
    } else {
      res.send({ "list:": data });
    }
  };
  dbConfig.sqlConnect(sql, sqlArr, callback);
};

module.exports = {
  getUser,
  getPost,
};
