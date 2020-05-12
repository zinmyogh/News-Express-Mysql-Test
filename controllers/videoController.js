const dbConfig = require("../config/dbConfig");
const user = require("./userController");
const userPost = require("./articleController");

// //视屏接收返回视屏的Url
// video = (file) => {
//   // const file = req.file;
//   console.log(file);
//   file.url = `http://192.168.0.106:3000/statics/images/${file.filename}`;
//   console.log(file.url);
//   return file.url;
// };

//获取所有视屏
fgetallvideo = async (req, res) => {
  let sql = `select * from videopost`;
  let result = await dbConfig.SySqlConnect(sql);
  if (result.length) {
    res.json({
      code: 200,
      msg: "获取成功",
      info: result,
    });
  } else {
    if (result.length == 0) {
      res.json({
        code: 201,
        msg: "还没有视屏哦，亲",
        result: result,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取失败！",
      });
    }
  }
};

//获取视屏ID
let fgetvideoID = (categoryName) => {
  let sql = `select categoryOrder from category where categoryName = ?`;
  let sqlArr = [categoryName];
  console.log("haha");
  return dbConfig.sqlConnect(sql, sqlArr);
};

//获取视屏by分类
fgetvideobycategory = async (req, res) => {
  let { categoryName } = req.body;
  let result = await fgetvideoID(categoryName);
  console.log(result);
  if (!result) {
    res.json({
      code: 201,
      msg: "获取失败！",
    });
  } else {
    let sql = `select * from videopost where categoryOrder = ?`;
    let sqlArr = [result];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.length) {
      res.json({
        code: 201,
        msg: "获取成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取失败！",
      });
    }
  }
};

//上传视屏
postvideo = async (req, res) => {
  // console.log("req. fiel >>>", req.file);
  let { videoUrl, caption, categoryID } = req.body;
  // console.log("req.body:  ", req.body);
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let userPostID = await userPost.userPost(result[0].userID, categoryID);
    // console.log("userpost: ", userPostID);
    let sql = `insert into videopost (videoUrl, caption, categoryID, userPostID, userID,createDate) values (?,?,?,?,?,?)`;
    let sqlArr = [
      videoUrl,
      caption,
      categoryID,
      userPostID,
      result[0].userID,
      new Date(),
    ];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "添加视屏成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "添加视屏失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "添加视屏失败！",
    });
  }
};

//删除文章
deletevideo = async (req, res) => {
  let { videoPostID } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `delete from videopost where videoPostID = ?`;
    let sqlArr = [videoPostID];
    let results = await SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: `删除成功`,
      });
    }
    res.json({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.json({
      code: 201,
      msg: "删除失败！",
    });
  }
};
module.exports = {
  fgetallvideo,
  fgetvideobycategory,
  postvideo,
  deletevideo,
};