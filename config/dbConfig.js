const mysql = require("mysql");
module.exports = {
  secret: "ha8gou$rxdrd230",
  host: "192.168.0.109",
  port: "3000",
  imageUrl: "http://192.168.0.109:3000/statics/images/",
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
      conn.query(sql, sqlArr, (err, rows) => {
        // console.log("yoyo");
        pool.end();
        conn.release();
        if (err) {
          return console.error(err);
        }
        callback(rows);
      });
      //释放连接
      // conn.release();
    });
  },
  //promise回调
  SySqlConnect: function (sysql, sqlArr) {
    return new Promise((resolve, reject) => {
      var pool = mysql.createPool(this.config);
      pool.getConnection((err, conn) => {
        // console.log("conn123");
        if (err) {
          // console.log("error1111  reject >>>>>>>>");
          reject(err);
        } else {
          conn.query(sysql, sqlArr, (err, data) => {
            // console.log("sheshe");
            conn.release();
            pool.end();
            if (err) {
              // console.log("conn error>>>>>>>>>>>");
              reject(err);
            } else {
              // console.log("data >>>>>>>>>>>");
              resolve(data);
            }
          });
          // console.log(pool.config.connectionLimit); // passed in max size of the pool
          // console.log(pool._freeConnections.length); // number of free connections awaiting use
          // console.log(pool._allConnections.length); // number of connections currently created, including ones in use
          // console.log(pool._acquiringConnections.length); // number of connections in the process of being acquired
          // conn.release();
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  },
};
