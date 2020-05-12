const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routers/routes");
const indes = require("./routers/index");
const user = require("./routers/user");
const admin = require("./routers/admin");
const follow = require("./routers/follow");
// const freearticle = require("./routers/freearticle");
const article = require("./routers/article");
const video = require("./routers/video");
const moment = require("./routers/moment");
const auth = require("./middlewares/auth");

const app = express();

const server = require("http").createServer(app);

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//post 请求
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
//静态资源
app.use("/statics", express.static(path.join(__dirname, "public")));

// app.use("/", routes);
app.use("/u", indes);
app.use("/user", auth(), user);
app.use("/admin", auth(), admin);
// app.use("/freearticle", freearticle);
app.use("/article", article);
app.use("/video", video);
app.use("/moment", moment);
app.use("/follow", follow);

server.listen(3000, "192.168.0.106", () => {
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
