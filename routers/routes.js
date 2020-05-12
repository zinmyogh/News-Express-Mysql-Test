const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const $user = require("../controllers/user/user");
const $test = require("../controllers/article/test");
//test
router.get("/get", (req, res, next) => {
  $user.queryAll(req, res, next);
});
// insert article into test
router.post("/blog/insert", (req, res, next) => {
  $test.addArticle(req, res, next);
});
//user login
router.post("/user/login", (req, res, next) => {
  $user.login(req, res, next);
});
//select article from test
router.post("/blog/select", (req, res, next) => {
  $test.selectArticle(req, res, next);
});

//photos upload

router.post("/blog/imgUpload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  file.url = `http://192.168.0.106:3000/statics/images/${file.filename}`;
  console.log(file.url);
  res.json({ code: 202, url: file.url });
});

//photos upload

router.post("/cover/imgUpload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  file.url = `http://192.168.0.106:3000/statics/images/${file.filename}`;
  console.log(file.url);
  res.json({ code: 202, url: file.url });
});

module.exports = router;

// const mdd = require("mobile-detect");

// more typically we would instantiate with 'window.navigator.userAgent'
// as user-agent; this string literal is only for better understanding

// router.get("/md", (req, res, next) => {
//   var md = new mdd(req.headers["user-agent"]);
//   console.log("haha");
//   console.log(md.mobile()); // 'Sony'
//   console.log(md.phone()); // 'Sony'
//   console.log(md.tablet()); // null
//   console.log(md.userAgent()); // 'Safari'
//   console.log(md.os()); // 'AndroidOS'
//   console.log(md.is("iPhone")); // false
//   console.log(md.is("bot")); // false
//   console.log(md.version("Webkit")); // 534.3
//   console.log(md.versionStr("Build")); // '4.1.A.0.562'
//   console.log(md.match("playstation|xbox")); // false
//   res.send("ok");
// });
