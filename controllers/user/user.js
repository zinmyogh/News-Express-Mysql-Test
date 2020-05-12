// const mysql = require("mysql");
// const jwt = require("jsonwebtoken");
// const def = require("../../config/dbConfig");
// const $sql = require("./query");

// const pool = mysql.createPool(def.mysql);

// module.exports = {
//   login: (req, res, next) => {
//     pool.getConnection((err, connection) => {
//       var param = req.body;
//       console.log("params: ", param);
//       connection.query(
//         "select * from user where userName = ?",
//         [param.userName],
//         (err, rows) => {
//           console.log(err);
//           console.log(rows);
//           if (err) return res.status(400).send("error: ", err);
//           if (!rows.length) {
//             return;
//             // res.send("not a user or password incorrect!");
//           } else {
//             const ret = JSON.stringify(rows);
//             const re = JSON.parse(ret);
//             console.log(re);
//             console.log({ re });
//             const haha = { re };
//             console.log(haha);
//             return res.status(200).send("ok");
//           }
//           // if (err) {
//           //   console.log("err: ", err);
//           //   res.send(err);
//           // } else {
//           //   const ret = JSON.stringify(result);
//           //   const re = JSON.parse(ret);
//           //   console.log(re);

//           //   const token = jwt.sign({ id: result.id }, def.secret);
//           //   console.log("token : ", token);
//           //   console.log("result: ", re);
//           //   res.json({ code: 202, re, token });
//           //   // } else {
//           //   // res.json({ code: 102, message: "user is not valid!" });
//           //   // }
//           // }
//           connection.release();
//         }
//       );
//     });
//   },
//   queryAll: function (req, res, next) {
//     pool.getConnection(function (err, connection) {
//       connection.query($sql.user.queryAll, function (err, result) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send(result);
//         }
//         connection.release();
//       });
//     });
//   },
// };

// // update(req, res, next) {
// //   pool.getConnection(function (err, connection) {
// //     var param = req.query || req.params;

// //     connection.query(
// //       $sql.update,
// //       [param.name, param.age, +param.id],
// //       function (err, result) {
// //         if (err) {
// //           res.send(err);
// //         } else {
// //           res.send("update success");
// //         }

// //         connection.release();
// //       }
// //     );
// //   });
// // },
