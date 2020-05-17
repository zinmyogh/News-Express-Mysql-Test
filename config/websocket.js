const express = require("express");
const expressWx = require("express-ws");

const router = express.Router();
expressWx(router);

router
  .ws("/ws", function (ws, req) {
    console.log("enter wx/text");
    ws.send("ok");
    ws.on("message", function (msg) {
      console.log(msg);
      ws.send(msg);
    });
    console.log("socket : ", req.testing);
  })
  .get("/test1", function (req, res) {
    res.send("haha");
  });
// var aWss = expressWx.getWss("/a");

// setInterval(() => {
//   aWss.clients.forEach(function (client) {
//     client.send("hello Client");
//   });
// }, 3000);

module.exports = router;
