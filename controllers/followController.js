const dbConfig = require("../config/dbConfig");

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
};
