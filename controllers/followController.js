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

//check is already follw
let checkFollow = async (user_id, follow_id) => {
  let sql = `select * from follow where user_id=? and follow_id=?`;
  let sqlArr = [user_id, follow_id];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  if (result.length) {
    return true;
  } else {
    return false;
  }
};

//follow
follow = async (req, res) => {
  let { user_id, follow_id } = req.query;
  //check is already follow
  if (!(await checkFollow(user_id, follow_id))) {
    if (user_id == follow_id) {
      res.send({
        code: 400,
        msg: "cant follow your self !!!",
      });
    } else {
      let sql = `insert into follow (follow_id, user_id, create_time)values(?,?,?)`;
      let sqlArr = [follow_id, user_id, new Date().valueOf()];
      let result = await dbConfig.SySqlConnect(sql, sqlArr);
      if (result.affectedRows == 1) {
        res.send({
          code: 200,
          msg: "follow success",
        });
      }
    }
  } else {
    res.send({
      code: 400,
      msg: "already follw !!!",
    });
  }
};

module.exports = {
  follow,
  getfollowers,
  getfollow,
};
