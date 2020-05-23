const dbConfig = require("../config/dbConfig");
const user = require("../controllers/userController");

// get follower
getfollowers = async (req, res) => {
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `select count(*) as count from follow where userID = ?`;
    let sqlArr = [result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results != "") {
      res.json({
        code: 200,
        msg: "获取成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "找不到用户！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "找不到用户！",
    });
  }
};
// get follower
getfollow = async (req, res) => {
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `select count(*) as count from follow where followerID = ?`;
    let sqlArr = [result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results != "") {
      res.json({
        code: 200,
        msg: "获取成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "找不到用户！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "找不到用户！",
    });
  }
};

module.exports = {
  getfollowers,
  getfollow,
};
