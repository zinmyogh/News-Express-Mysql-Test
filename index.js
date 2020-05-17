const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routers/user");
const admin = require("./routers/admin");
const follow = require("./routers/follow");
const article = require("./routers/article");
const video = require("./routers/video");
const moment = require("./routers/moment");
const auth = require("./middlewares/auth");
const config = require("./config/dbConfig");
const expressWx = require("express-ws");
const wx = require("./config/websocket");

const app = express();

const server = require("http").createServer(app);
expressWx(app, server);
app.use(cors());
app.use(express.json());
//post 请求
app.use(bodyParser.json());
//静态资源
app.use("/statics", express.static(path.join(__dirname, "public")));

app.use("/user", auth(), user);
app.use("/admin", auth(), admin);
app.use("/article", article);
app.use("/video", video);
app.use("/moment", moment);
app.use("/follow", follow);

app.use("/wx", wx);

server.listen(config.port, config.host, () => {
  console.log(server.address());
});

// //处理跨域
// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();

// });
