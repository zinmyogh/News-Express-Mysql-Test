const dbConfig = require("../config/dbConfig");
const user = require("./userController");
const uuid = require("uuid");

//获取所有分类标题
let getallcategory = () => {
  let sql = `select * from category`;
  return dbConfig.SySqlConnect(sql);
};

//获取分类 by 分类标题名
let checkCategoryByName = (ctyName) => {
  let sql = `select * from category where categoryName = ?`;
  let sqlArr = [ctyName];
  return dbConfig.SySqlConnect(sql, sqlArr);
};

//获取分类 by 分类标 uuid
let checkCategoryByOrder = (ctyOrder) => {
  let sql = `select * from category where categoryOrder = ?`;
  let sqlArr = [ctyOrder];
  return dbConfig.SySqlConnect(sql, sqlArr);
};
uploadimages = async (req, res) => {
  let url = [];
  req.files.forEach((i) => {
    url.push(`${i.originalname}`);
  });
  res.json({
    code: 200,
    url: url,
  });
};
//上传轮播图
adminimage = async (req, res) => {
  let { images } = req.body;
  let sql = `insert into adminimage (images, createDate) values (?,?)`;
  let sqlArr = [images.toString(), new Date()];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  if (result.affectedRows == 1) {
    res.send({
      code: 200,
      msg: "上传成功",
    });
  } else {
    res.send({
      code: 201,
      msg: "上传失败！",
    });
  }
};

//获取所有分类标题
getcategory = async (req, res) => {
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let results = await getallcategory();
    if (results) {
      res.json({
        code: 200,
        msg: "获取分类成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取分类失败！",
      });
    }
  }
};

//添加分类标题
addcategory = async (req, res) => {
  console.log(req.body);
  let token = req.headers.authorization;
  let { categoryName } = req.body;
  let result = await user.checkTokenGetInfo(token);
  //   console.log(cty, result);
  if (result.length) {
    let cat = await checkCategoryByName(categoryName);
    if (cat.length != 0) {
      res.json({
        code: 201,
        msg: "该分类标题已经存在！",
      });
    } else {
      let sql = `insert into category (categoryName, categoryOrder) values (?,?) `;
      let sqlArr = [categoryName, uuid.v1()];
      let results = await dbConfig.SySqlConnect(sql, sqlArr);
      if (results.affectedRows == 1) {
        res.json({
          code: 200,
          msg: "添加分类标题成功",
        });
      } else {
        res.json({
          code: 201,
          msg: "标题分类添加失败！",
        });
      }
    }
  }
};

//更改分类标题名
updatecategory = async (req, res) => {
  console.log(req.body);
  let { categoryName, categoryOrder } = req.body;
  // let categoryOrder = req.body.categoryOrder;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  // console.log("result: ", result);
  if (result.length) {
    let results = await checkCategoryByOrder(categoryOrder);
    // console.log("results: ", results);
    if (results.length) {
      let sql = `update category set categoryName = ? where categoryOrder = ? `;
      let sqlArr = [categoryName, categoryOrder];
      let resultss = await dbConfig.SySqlConnect(sql, sqlArr);
      // console.log("resulttss: ", resultss);
      if (resultss.affectedRows == 1) {
        res.json({
          code: 200,
          msg: "更改分类标题名成功",
        });
      } else {
        res.json({
          code: 201,
          msg: "更改分类标题名失败！",
        });
      }
    } else {
      res.json({
        code: 202,
        msg: "没有分类标题名更改失败！",
      });
    }
  } else {
    res.json({
      code: 203,
      msg: "更改分类标题名失败！",
    });
  }
};

//删除分类标题byID
deletecategory = async (req, res) => {
  console.log("del: ", req.body);
  let { categoryOrder } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let results = await checkCategoryByOrder(categoryOrder);
    if (results.length) {
      let sql = `delete from category where categoryOrder = ?`;
      let sqlArr = [categoryOrder];
      let resultss = await dbConfig.SySqlConnect(sql, sqlArr);
      if (resultss.affectedRows == 1) {
        res.json({
          code: 200,
          msg: "删除分类标题成功",
        });
      } else {
        res.json({
          code: 201,
          msg: "删除分类标题成功",
        });
      }
    } else {
      res.json({
        code: 201,
        msg: "删除分类标题成功",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "删除失败！",
    });
  }
};

//上传广告
insertadv = async (req, res) => {
  let { caption, advImage, validDay, advUrl } = req.body;
  let token = req.headers.authorization;
  let result = await user.checkTokenGetInfo(token);
  if (result.length) {
    let sql = `insert into advertisement (caption, advImage, createDate, validDay, advUrl) values (?,?,?,?,?)`;
    let sqlArr = [caption, advImage, new Date(), validDay, advUrl];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "添加广告成功",
      });
    } else {
      res.json({
        code: 201,
        msg: "添加广告失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "添加广告失败！",
    });
  }
};

module.exports = {
  getallcategory,
  checkCategoryByName,
  checkCategoryByOrder,
  uploadimages,
  adminimage,
  getcategory,
  addcategory,
  updatecategory,
  deletecategory,
  insertadv,
};
