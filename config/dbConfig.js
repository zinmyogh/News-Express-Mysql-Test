const mysql = require("mysql");
module.exports = {
  secret: "ha8gou$rxdrd230",
  config: {
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "news",
    port: 3306,
  },
  sqlConnect(sql, sqlArr, callback) {
    var pool = mysql.createPool(this.config);
    pool.getConnection((err, conn) => {
      console.log("connected to database");
      if (err) {
        console.log("connect to mysql error!");
        return;
      }
      //事件驱动回调
      conn.query(sql, sqlArr, callback);
      //释放连接
      conn.release();
    });
  },
  //promise回调
  SySqlConnect: function (sysql, sqlArr) {
    return new Promise((resolve, reject) => {
      var pool = mysql.createPool(this.config);
      pool.getConnection((err, conn) => {
        console.log("conn123");
        if (err) {
          reject(err);
        } else {
          conn.query(sysql, sqlArr, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
          conn.release();
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  },
};
