const dbConfig = require("../config/dbConfig");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mdUtils = require("../utils/md5");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//密码加密
let md5Pwd = (password) => {
  const salt = "230zmo$A@Zz2a!";
  return mdUtils.md5(password + salt);
};
//获取用户信息
let getUsers = (phone) => {
  let sql = `select date_format(birthday, '%Y-%m-%d') birthday, userID, password, address, introduction,phone, profilePic,sex,userName from user where phone=? or userName=?`;
  let sqlArr = [phone, phone];
  let result = dbConfig.SySqlConnect(sql, sqlArr);
  return result;
};

//用户注册
register = async (req, res) => {
  let phone = req.body.phone;
  let password = req.body.password;
  // console.log(req.body);
  let result = await getUsers(phone);
  if (result.length != 0) {
    // console.log("ale: ", result);
    res.status(201).send({
      code: 201,
      msg: "该手机号已经被注册",
    });
  } else {
    // console.log("注册中。。。");
    let sql = `insert into user(phone, password, createDate) values (?,?,?)`;
    let sqlArr = [phone, md5Pwd(password), new Date()];

    let callback = async (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          code: 400,
          msg: "注册出错了!",
        });
      } else {
        res.json({
          code: 200,
          msg: "注册成功了",
          // data: data,
        });
      }
    };
    dbConfig.sqlConnect(sql, sqlArr, callback);
  }
};

//用户，手机号登录
login = async (req, res) => {
  let phone = req.body.phone;
  let password = req.body.password;
  // console.log(phone, password);
  let result = await getUsers(phone);
  // console.log("result: ", result);
  if (result.length == 0) {
    // console.log(result.phone);
    res.status(201).send({
      code: 201,
      msg: "该账号不存在！",
    });
  } else {
    let chpass = md5Pwd(password);
    // console.log("result; ", result[0].phone);
    if (phone == result[0].phone && chpass == result[0].password) {
      // console.log("iddidid: ", result[0].userID);
      const token = jwt.sign({ userID: result[0].userID }, dbConfig.secret);
      // console.log("token : ", token);
      res.status(200).send({
        code: 200,
        msg: "登录成功",
        info: result[0],
        token: token,
      });
    } else {
      res.status(201).send({
        code: 201,
        msg: "登录失败了！",
      });
    }
  }
};
//验证token
let checkTokenGetInfo = async (token) => {
  // console.log(token);
  const { userID } = jwt.verify(token, dbConfig.secret);
  // console.log({ userID });
  // console.log("userID : ", userID);
  if (!userID) {
    return false;
  } else {
    let user = await getUserByuserID(userID);
    return user;
  }
};
//获取用户信息by userID
let getUserByuserID = async (userID) => {
  let sql = `select date_format(birthday, '%Y-%m-%d') birthday, userID, password, address, introduction,phone, profilePic,sex,userName from user where userID=?`;
  let sqlArr = [userID];
  let res = dbConfig.SySqlConnect(sql, sqlArr);
  return res;
};
//更改密码
changepass = async (req, res) => {
  console.log(req.body, req.data, req.params, req.query);
  let { oldpassword, newpassword } = req.body;
  // let newpassword = req.body.newpassword;
  let token = req.headers.authorization;
  let result = await checkTokenGetInfo(token);
  console.log("change pass enter: ", result);
  // console.log(result[0].password);

  let op = md5Pwd(oldpassword);
  if (op != result[0].password) {
    res.json({
      code: 201,
      msg: "您输入的旧密码不正确！",
    });
  } else {
    let sql = `update user set password = ? where userID = ?`;
    let sqlArr = [md5Pwd(newpassword), result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "更改密码成功",
      });
    } else {
      res.json({
        code: 201,
        msg: "更改密码失败！",
      });
    }
  }
};
//获取用户发布得到的总赞数
gettotallikecount = async (req, res) => {
  let token = req.headers.authorization;
  let result = await checkTokenGetInfo(token);
  let sql = `select sum(likeCount) as totalcount  from ( 
    select sum(likeCount) as likeCount from articlepost where userID = ?
    union all
    select sum(likeCount) as likeCount from videopost where userID =?
    union all
    select sum(likeCount) as likeCount from momentpost where userID = ?
    ) zike `;
  let sqlArr = [result[0].userID, result[0].userID, result[0].userID];
  let results = await dbConfig.SySqlConnect(sql, sqlArr);
  if (results != "") {
    res.json({
      code: 200,
      msg: "get tc success",
      info: results,
    });
  } else {
    res.json({
      code: 201,
      msg: "get tc error",
    });
  }
};

//获取发表文章总数
getarticlepostcount = async (req, res) => {
  let token = req.headers.authorization;
  let result = await checkTokenGetInfo(token);
  if (result.length) {
    let sql = `select count(*) as count from articlepost where userID = ? `;
    let sqlArr = [result[0].userID];
    const results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results != "") {
      res.json({
        code: 200,
        msg: "获取成功",
        info: results,
      });
    } else {
      res.json({
        code: 201,
        msg: "获取失败！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "获取失败！",
    });
  }
};

//添加用户信息
adduserinfo = async (req, res) => {
  let { userName, introduction } = req.body;
  // console.log("req.body: ", req.body);
  let token = req.headers.authorization;
  let result = await checkTokenGetInfo(token);
  // console.log(result[0].userID);
  if (result.length != "") {
    let sql = `update user set userName = ?,introduction = ? where userID = ?`;
    let sqlArr = [userName, introduction, result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      let info = await getUserByuserID(result[0].userID);
      res.json({
        code: 200,
        msg: "上传信息成功",
        info: info[0],
      });
    } else {
      res.json({
        code: 201,
        msg: "上传信息失败了！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "上传信息失败了！",
    });
  }
};

//上传头像
uploadprofile = async (req, res) => {
  let token = req.headers.authorization;
  // console.log("img token: ", token);
  let file = req.file;
  // console.log(file);
  file.url = `${dbConfig.imageUrl + file.filename}`;
  // console.log(file.url);
  let result = await checkTokenGetInfo(token);
  // console.log("re: ", result);
  if (result.length) {
    let sql = `update user set profilePic = ? where userID = ?`;
    let sqlArr = [file.url, result[0].userID];
    let results = await dbConfig.SySqlConnect(sql, sqlArr);
    if (results.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "上传头像成功",
        url: file.url,
      });
    } else {
      res.json({
        code: 201,
        msg: "上传头像失败了！",
      });
    }
  } else {
    res.json({
      code: 201,
      msg: "服务器繁忙！",
    });
  }
};

getuserinfo = async (req, res) => {
  let token = req.headers.authorization;
  let result = await checkTokenGetInfo(token);
  if (result.length) {
    res.json({
      code: 200,
      msg: "获取信息成功",
      info: result,
    });
  } else {
    res.json({
      code: 201,
      msg: "获取信息失败！",
    });
  }
};

// uploadimages = async (req, res) => {
//   console.log(req.files);
//   // let imgPath = [];
//   let url = [];
//   req.files.forEach((i) => {
//     // imgPath.push(i.paht);
//     // console.log("i.path: ", i.path);
//     url.push(`http://192.168.0.106:3000/static/images/${i.originalname}`);
//   });

//   for (let i = 0; i < url.length; i++) {
//     console.log(i, url[i]);
//   }

//   res.send({
//     code: 222,
//     msg: "testing",
//     url: url,
//   });
// };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  checkTokenGetInfo,
  register,
  login,
  changepass,
  gettotallikecount,
  getarticlepostcount,
  adduserinfo,
  uploadprofile,
  getuserinfo,
};
