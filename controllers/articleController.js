const dbConfig = require("../config/dbConfig");
const user = require("../controllers/userController");

//添加userPostID表
let userPost = async (userID, categoryID) => {
  let sql = `insert into userpost (userID,createDate, categoryID) values (?,?,?)`;
  let sqlArr = [userID, new Date(), categoryID];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  // console.log(result);
  return result.insertId;
  // if (result.affectedRows == 1) {
  //   console.log(result);
  //   return result.insertID;
  // } else {
  //   return false;
  // }
};

//文章图片接收返回图片的Url
articleimage = (req, res) => {
  const file = req.file;
  console.log(file);
  file.url = `http://192.168.0.106:3000/statics/images/${file.filename}`;
  console.log(file.url);
  res.json({ code: 200, url: file.url });
};

//获取所有文章
fgetallarticle = async (req, res) => {
  let sql = `select * from articlePost`;
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
        msg: "还没有文章哦，亲",
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
//获取文章ID
let fgetarticleID = (categoryName) => {
  let sql = `select categoryOrder from category where categoryName = ?`;
  let sqlArr = [categoryName];
  // console.log("haha");
  return dbConfig.sqlConnect(sql, sqlArr);
};
//获取文章by分类
fgetarticlebycategory = async (req, res) => {
  let { categoryName } = req.body;
  let result = await fgetarticleID(categoryName);
  // console.log(result);
  if (!result) {
    res.json({
      code: 201,
      msg: "获取失败！",
    });
  } else {
    let sql = `select * from articlepost where categoryOrder = ?`;
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

//上传文章
postarticle = async (req, res) => {
  let {
    // userPostID,
    // userID,
    categoryID,
    caption,
    content,
    cover1,
    cover2,
    cover3,
  } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let userPostID = await userPost(result[0].userID, categoryID);
    // console.log("userpost: ", userPostID);
    let sql = `insert into articlepost (userPostID, userID, categoryID, caption, content, cover1, cover2, cover3,createDate) values (?,?,?,?,?,?,?,?,?)`;
    let sqlArr = [
      userPostID,
      result[0].userID,
      categoryID,
      caption,
      content,
      cover1,
      cover2,
      cover3,
      new Date(),
    ];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "添加文章成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "添加文章失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "添加文章失败！",
    });
  }
};

//删除文章
deletearticle = async (req, res) => {
  let { articlePostID } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `delete from articlepost where articlePostID = ?`;
    let sqlArr = [articlePostID];
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
  userPost,
  articleimage,
  fgetallarticle,
  fgetarticlebycategory,
  postarticle,
  deletearticle,
};
