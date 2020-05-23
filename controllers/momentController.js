const dbConfig = require("../config/dbConfig");
const user = require("../controllers/userController");

uploadimages = async (req, res) => {
  // console.log(req.files);
  let url = [];
  req.files.forEach((i) => {
    // url.push(`${dbConfig.imageUrl + i.originalname}`);
    url.push(`${i.originalname}`);
  });
  res.send({
    code: 200,
    msg: "testing multiple images",
    url: url,
  });
};
//获取个人上传的所有动态朋友圈
getmoment = async (req, res) => {
  let token = req.headers.authorization;
  const result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `select momentPostID, userID, content, images, likeCount, createDate from momentpost where userID =?`;
    let sqlArr = [result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    // console.log(results);
    if (results.length) {
      res.json({
        code: 200,
        msg: "获取动态成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取动态失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "用户不存在！",
    });
  }
};
//上传朋友圈
postmoment = async (req, res) => {
  let { content, images } = req.body;
  console.log("moment: ", req.body);

  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    // console.log("images: ", images);
    // console.log("images toString(): ", images.toString());
    let sql = `insert into momentpost (userID, content, images ,createDate) values (?,?,?,?)`;
    let sqlArr = [result[0].userID, content, images.toString(), new Date()];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "添加朋友圈成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "添加朋友圈失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "添加朋友圈失败！",
    });
  }
};

//删除朋友圈
deletemoment = async (req, res) => {
  let { momentPostID } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `delete from momentpost where momentPostID = ?`;
    let sqlArr = [momentPostID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: `删除成功`,
      });
    } else {
      res.json({
        code: 201,
        msg: "删除失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "删除失败！",
    });
  }
};

module.exports = {
  getmoment,
  postmoment,
  uploadimages,
  deletemoment,
};
