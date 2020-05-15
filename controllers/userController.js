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
//添加用户信息
adduserinfo = async (req, res) => {
  // console.log("change info ", req.body, req.params, req.query);
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
//取随机数
function rand(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}
validatePhoneCode = [];
let sendCodeP = (phone) => {
  for (var item of validatePhoneCode) {
    if (phone == item.phone) {
      return true;
    }
  }
  return false;
};

let findCodeAndPhone = (phone, code) => {
  for (var item of validatePhoneCode) {
    if (phone == item.phone && code == item.code) {
      return "login";
    }
  }
  return "error";
};

//检查是否是第一次登录，以验证码
let phoneLoginBind = async (phone) => {
  let sql = "select * from user where username=? or phone=?";
  let sqlArr = [phone, phone];
  let res = await dbConfig.SySqlConnect(sql, sqlArr);
  if (res.length) {
    res[0].userinfo = await getUserInfo(res[0].id);
    return res;
  } else {
    //用户第一次注册，绑定表
    let res = await regUesr(phone);
    ////获取用户详情
    res[0].userinfo = await getUserInfo(res[0].id);
    return res;
    //用户注册
  }
};

//用户注册
let regUesr = async (phone) => {
  //检验用户是不是第一次注册
  let userPic = "http://localhost:3000/user.jpg";
  let sql = `insert into user(username, userPic,phone)values(?,?,?)`;
  let sqlArr = [phone, userPic, phone];
  let res = await dbConfig.SySqlConnect(sql, sqlArr);
  if (res.affectedRows == 1) {
    //执行成功获取用户信息
    //获取用户信息的方法
    let user = await getUsers(phone);
    //绑定用户的附表
    let userinfo = await createUserInfo(user[0].id);
    // let userinfo = "/do";
    if (userinfo.affectedRows == 1) {
      return user;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//创建附表
let createUserInfo = (user_id) => {
  let sql = `insert into userinfo(user_id, age, sex, job) values(?,?,?,?)`;
  let sqlArr = [user_id, 18, 2, "no job"];
  return dbConfig.SySqlConnect(sql, sqlArr);
};

//获取用户详情
let getUserInfo = (user_id) => {
  let sql = `select * from userinfo where user_id=?`;
  let sqlArr = [user_id];
  return dbConfig.SySqlConnect(sql, sqlArr);
};

//查看用户详情
let findUserInfo = async (user_id) => {
  let sql = `select * from userinfo where user_id=?`;
  let sqlArr = [user_id];
  const res = await dbConfig.SySqlConnect(sql, sqlArr);
  if (res.length) {
    return true;
  } else {
    return false;
  }
};

//修改用户信息详情
let setUerInfo = async (user_id, age, sex, job, path, birthday) => {
  if (await findUserInfo(user_id)) {
    let sql = `update userinfo set age=?, sex=?, job=?, path=?, birthday=? where user_id=?`;
    let sqlArr = [age, sex, job, path, birthday, user_id];
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
      let user = await getUsers(user_id);
      let userinfo = await getUserInfo(user_id);
      user[0].userinfo = userinfo[0];
      return user;
    } else {
      return false;
    }
  } else {
    let sql = `insert into userinfo (user_id, age, sex, job, path, birthday) values(?,?,?,?,?,?)`;
    let sqlArr = [user_id, age, sex, job, path, birthday];
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
      let user = await getUsers(user_id);
      let userinfo = await getUserInfo(user_id);
      user[0].userinfo = userinfo[0];
      return user;
    } else {
      return false;
    }
  }
};

//修改用户名
let setUserName = async (user_id, username) => {
  let sql = `update user set username=? where id=?`;
  let sqlArr = [username, user_id];
  let res = await dbConfig.SySqlConnect(sql, sqlArr);
  if (res.affectedRows == 1) {
    return true;
  } else {
    return false;
  }
};

//检查用户密码
let getUsersPassword = async (user_id) => {
  let sql = `select password from user where id=?`;
  let sqlArr = [user_id];
  let res = await dbConfig.SySqlConnect(sql, sqlArr);
  console.log(res);
  if (res.length) {
    return res[0].password;
  } else {
    return 0;
  }
};

//模拟发送验证码
sendCode = (req, res) => {
  let phone = req.query.phone;
  if (sendCodeP(phone)) {
    res.send({
      code: 400,
      msg: "alerady send code",
    });
  }
  let code = rand(1000, 9999);
  validatePhoneCode.push({
    phone: phone,
    code: code,
  });
  console.log(validatePhoneCode);
  res.send({
    code: 200,
    msg: "send code success",
  });
  console.log(code);
};

//验证登录
codePhoneLogin = async (req, res) => {
  let { phone, code } = req.query;
  //该手机号是否发送过验证码
  if (sendCodeP(phone)) {
    //验证码和手机号是否匹配
    let status = findCodeAndPhone(phone, code);
    if (status == "login") {
      //登录成功
      let user = await phoneLoginBind(phone);
      res.send({
        code: 200,
        msg: "login success",
        data: user[0],
      });
    } else if (status == "error") {
      res.send({
        code: 400,
        msg: "login failed",
      });
    } else {
      res.send({
        code: 400,
        msg: "code not send to this phone",
      });
    }
  }
};

//用户名或手机号登录
logins = (req, res) => {
  let username = req.query.username;
  let password = req.query.password;

  let phone = /^[123456789]\d{9}$/;
  let email = /^([a-zA-Z]|[0-9])(\w|=)+@[a-zA-Z0-9]+.([a-zA-Z]{2,4})$/;

  if (phone.test(username)) {
    let sql =
      "select * from user where phone=? and password=? or username=? and password=?";
    let sqlArr = [username, password, username, password];
    let callback = async (err, data) => {
      if (err) {
        console.log(err);
        res.send({
          code: 400,
          msg: "error lar",
        });
      } else if (data == "") {
        res.send({
          code: 400,
          msg: "username or password error",
        });
      } else {
        let user_id = data[0].id;
        let result = await getUserInfo(user_id);
        data[0].userinfo = result[0];
        res.send({
          code: 200,
          msg: "login successful",
          data: data[0],
        });
      }
    };
    dbConfig.sqlConnect(sql, sqlArr, callback);
  } else if (email.test(username)) {
    let sql = `select * from user where email=? and password=? `;
    let sqlArr = [username, password];

    let callback = async (err, data) => {
      if (err) {
        console.log(err);
        res.send({
          code: 400,
          msg: "error lar",
        });
      } else if (data == "") {
        res.send({
          code: 400,
          msg: "email or password error",
        });
      } else {
        let user_id = data[0].id;
        let result = await getUserInfo(user_id);
        data[0].userinfo = result[0];
        res.send({
          code: 200,
          msg: "login successful",
          data: data[0],
        });
      }
    };
    dbConfig.sqlConnect(sql, sqlArr, callback);
  } else {
    let sql = `select * from user where username=? and password=?`;
    let sqlArr = [username, password];

    let callback = async (err, data) => {
      if (err) {
        console.log(err);
        res.send({
          code: 400,
          msg: "error lar",
        });
      } else if (data == "") {
        res.send({
          code: 400,
          msg: "email or password error",
        });
      } else {
        let user_id = data[0].id;
        let result = await getUserInfo(user_id);
        data[0].userinfo = result[0];
        res.send({
          code: 200,
          msg: "login successful",
          data: data[0],
        });
      }
    };
    dbConfig.sqlConnect(sql, sqlArr, callback);
  }
};

//修改资料
editUserInfo = async (req, res) => {
  let { user_id, username, age, sex, job, path, birthday } = req.query;
  let result = await setUserName(user_id, username);
  if (result) {
    let ress = await setUerInfo(user_id, age, sex, job, path, birthday);
    if (ress.length) {
      res.send({
        code: 200,
        data: ress[0],
      });
    } else {
      res.send({
        code: 400,
        msg: "change info fail",
      });
    }
  } else {
    res.send({
      code: 400,
      msg: "change info fail",
    });
  }
};

setPassword = async (req, res) => {
  let { user_id, oldpassword, newpassword } = req.query;
  //检查用户密码
  let userPass = await getUsersPassword(user_id);
  console.log(userPass);
  if (userPass) {
    if (oldpassword == userPass) {
      let sql = `update user set password=? where id=?`;
      let sqlArr = [newpassword, user_id];
      let result = await dbConfig.SySqlConnect(sql, sqlArr);
      if (result.affectedRows == 1) {
        res.send({
          code: 200,
          msg: "change pass success",
        });
      } else {
        res.send({
          code: 400,
          msg: "change pass failed",
        });
      }
    } else {
      res.send({
        code: 400,
        msg: "not same to change password",
      });
    }
  } else {
    let sql = `update user set password=? where id=?`;
    let sqlArr = [password, user_id];
    let result = await dbConfig.SySqlConnect(sql, sqlArr);
    if (result.affectedRows == 1) {
      res.send({
        code: 200,
        msg: "change pass success",
      });
    } else {
      res.send({
        code: 400,
        msg: "change pass failed",
      });
    }
  }
};

//绑定邮箱
bindEmail = async (req, res) => {
  let { user_id, email } = req.query;
  let sql = `update user set email=? where id=?`;
  let sqlArr = [email, user_id];
  let result = await dbConfig.SySqlConnect(sql, sqlArr);
  console.log(result);
  if (result.affectedRows == 1) {
    res.send({
      code: 200,
      msg: "bind email success",
    });
  } else {
    res.send({
      code: 400,
      msg: "bind email failed",
    });
  }
};
// logout
logout = (req, res) => {
  res.send({
    code: 200,
    msg: "logout success",
  });
};
//修改头像
editUserImage = (req, res) => {
  if (req.file.length === 0) {
    res.render("error", { message: "upload image should not be null" });
    return;
  } else {
    let file = req.file;
    console.log(file);
    fs.renameSync(
      "./public/uploads/" + file.filename,
      "./public/uploads/" + file.originalname
    ); //这里修改文件名字，比较随意。
    res.set({
      "content-type": "application/json; charset=utf-8",
    });
    let { user_id } = req.query;
    let imgUrl = "http://localhost:3000/uploads" + file.originalname;
    let sql = `update user set userPic = ? where id=?`;
    let sqlArr = [imgUrl, user_id];
    dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
      if (err) {
        console.log(err);
        throw "errors image ";
      } else {
        if (data.affectedRows == 1) {
          res.send({
            code: 200,
            msg: "change profile success",
            url: imgUrl,
          });
        } else {
          res.send({
            code: 400,
            msg: "change profile failed",
          });
        }
      }
    });
  }
};

//多图上传
uploadMoreImg = (req, res) => {
  let files = req.files;
  if (req.files.length === 0) {
    res.render("error", { message: "upload image should not be null" });
    return;
  } else {
    for (var i in files) {
      res.set({
        "content-type": "application/json; charset=utf-8",
      });
      let file = files[i];
      fs.renameSync(
        "./public/uploads/" + file.filename,
        "./public/uploads/" + file.originalname
      ); //这里修改文件名字，比较随意。
      let { user_id } = req.query;
      let url = "http://localhost:3000/uploads" + file.originalname;
      let sql = `insert into image(url, create_time, user_id) values(?,?,?)`;
      let sqlArr = [url, new Date().valueOf(), user_id];
      dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.affectedRows == 1) {
            res.send({
              code: 200,
              msg: "upload success",
            });
          } else {
            res.send({
              code: 400,
              msg: "upload failed",
            });
          }
        }
      });
    }
  }
};

//发布视频
publish = async (req, res) => {
  let { user_id, title, url, isopen, postimg } = req.query;
  let sql = `insert into post(user_id, title, url, isopen, postimg, create_time) values (?,?,?,?,?,?)`;
  let sqlArr = [user_id, title, url, isopen, postimg, new Date().valueOf()];
  // 视频列表的id
  let post_id = await dbConfig
    .SySqlConnect(sql, sqlArr)
    .then((res) => {
      console.log(res);
      return res.insertId;
    })
    .catch((err) => {
      return false;
    });
  if (post_id) {
    res.send({
      code: 200,
      msg: "发布成功",
    });
  } else {
    res.send({
      code: 400,
      msg: "发布失败",
    });
  }
};

module.exports = {
  checkTokenGetInfo,
  register,
  login,
  changepass,
  adduserinfo,
  uploadprofile,
  // uploadimages,
  getuserinfo,

  // sendCode,
  // codePhoneLogin,

  // editUserInfo,
  // setPassword,
  // bindEmail,
  // logout,
  // editUserImage,
  // uploadMoreImg,
  // publish,
};
