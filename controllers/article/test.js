// const mysql = require("mysql");
// const def = require("../../config/dbConfig");
// const $sql = require("../user/query");

// const pool = mysql.createPool(def.mysql);

// module.exports = {
//   addArticle(req, res, next) {
//     pool.getConnection(function (err, connection) {
//       var param = req.body;
//       console.log(" article param: ", param);
//       console.log(req.body);

//       connection.query(
//         $sql.test.insert,
//         [param.title, param.article, param.cover, param.create_time],
//         function (err, result) {
//           if (err) {
//             res.json({ code: 000, message: "上传失败了：(", err });
//           } else {
//             res.json({ code: 202, message: "上传文章成功", result });
//           }

//           // 释放连接
//           connection.release();
//         }
//       );
//     });
//   },
//   selectArticle(req, res, next) {
//     pool.getConnection(function (err, connection) {
//       var id = req.body.id;

//       // console.log(req.param.id);
//       // console.log("query: ", req.query);
//       // console.log("body: ", req.body);
//       // var param = req.body.article;
//       // console.log(" article param: ", param);
//       console.log("id: ", id);

//       connection.query($sql.test.select, id, function (err, result) {
//         if (err) {
//           res.json({ code: 000, message: "获取失败了：(", err });
//         } else {
//           res.send({
//             code: 202,
//             message: "获取文章成功",
//             result,
//           });
//         }

//         // 释放连接
//         connection.release();
//       });
//     });
//   },
// };
