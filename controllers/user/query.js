var user = {
  login: "select * from user where username= ?",
  insert: "INSERT INTO user(id, name, age) VALUES(0,?,?)",
  update: "update user set name=?, age=? where id=?",
  delete: "delete from user where id=?",
  queryAll: "select * from user",
  queryA: "select * from post  ",
};

var test = {
  insert:
    "insert into test(title, article, cover1,create_time) values (?,?,?,?)",
  select: "select * from test where id=?",
};

module.exports = { user, test };
