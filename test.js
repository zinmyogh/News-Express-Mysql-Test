const request = require("request");
//取彩票数据
getCbData1();
function getCbData1() {
  request(
    {
      url: "http://swapi.cg6188.com/zhoujiapiyf/app/api.do",
      method: "post",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: {
        hashCode: "kb999_d90e4ddb-798d-4102-b05c-e004b7",
        command: "LOGIN",
        params: {
          username: "kb999",
          password: "fef03de26ca629024a2246e86b3274d9",
          currency: "TEST", //CNY
          language: "EN",
          line: 0,
          liveLotteryType: "APP",
        },
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("body:", body);
      }
    }
  );
}
