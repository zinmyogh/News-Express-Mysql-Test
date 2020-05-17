const dbConfig = require("../config/dbConfig");
const user = require("../controllers/userController");
const config = require("../config/dbConfig");

//添加userPostID表
let userPost = async (userID, categoryID) => {
  let sql = `insert into userpost (userID,createDate, categoryID) values (?,?,?)`;
  let sqlArr = [userID, new Date(), categoryID];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  // console.log(result);
  return result.insertId;
};
//获取分类名称
let getCategoryNameByID = (categoryID) => {
  let sql = `select * from category where categoryID = ?`;
  let sqlArr = [categoryID];
  return dbConfig.SySqlConnect(sql, sqlArr);
};
//文章图片接收返回图片的Url
articleimage = (req, res) => {
  const file = req.file;
  // console.log(file);
  file.url = `${config.imageUrl + file.filename}`;
  // console.log(file.url);
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

//获取热点
gethotarticle = async (req, res) => {
  let sql = `select articlePostID, content, caption, likeCount from articlepost order by likeCount DESC limit 4 `;
  const result = await dbConfig.SySqlConnect(sql);
  res.json({
    code: 200,
    info: result,
  });
};

//获取文章by分类
getarticlebyid = async (req, res) => {
  console.log("gg");
  let { articlePostID } = req.body;
  console.log("req>>>>>", req.body);
  // console.log(result);
  let sql = `select content, caption, date_format(createDate, '%Y-%m-%d')createDate from articlepost where articlePostID = ?`;
  let sqlArr = [articlePostID];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  if (result.length) {
    res.json({
      code: 200,
      msg: "获取成功",
      info: result,
    });
  } else {
    res.json({
      code: 201,
      msg: "获取失败！",
    });
  }
};

//获取所有个人上传的文章
getarticle = async (req, res) => {
  let token = req.headers.authorization;
  const result = await user.checkTokenGetInfo(token);
  // console.log("check: >>>", result);
  if (result.length) {
    let sql = `select articlepost.articlePostID, articlepost.userPostID, articlepost.userID, articlepost.caption,  articlepost.content, articlepost.cover1, articlepost.likeCount, articlepost.viewCount, date_format(createDate, '%Y-%m-%d') createDate, category.categoryName from articlepost inner JOIN category  where articlepost.categoryID = category.categoryID and userID =?`;
    // let sql = `select articlepost.articlePostID, articlepost.caption, articlepost.categoryID, category.categoryName from category left join articlepost where articlepost.categoryID = category.categoryID`;
    let sqlArr = [result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    // console.log(results);
    // console.log("getarticle results: ", results[0].categoryID);
    if (results.length) {
      res.json({
        code: 200,
        msg: "获取文章成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取文章失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "用户不存在！",
    });
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
  userPost,
  articleimage,
  fgetallarticle,
  fgetarticlebycategory,
  gethotarticle,
  getarticlebyid,
  getarticle,
  postarticle,
  deletearticle,
};
