const db = require("../db/connection");
const { checkHashedPassword } = require("../utils");

exports.checkUserExists = (id) => {
  return db
    .query(
      `SELECT * 
               FROM users
                WHERE user_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.checkUserPassword = (credentials) => {
  const { password, username } = credentials;
    return db.query(
        `SELECT password
        from users
        WHERE username = $1`,
        [username]
    ).then(({rows}) => {
        const userPass = rows[0].password
        return checkHashedPassword(password, userPass)
    }).then((loginResult) => {
        if (!loginResult){
            return Promise.reject({status:401, msg: "not authorised"})
        }
        //else send token
    })
     


};

exports.checkUsernameExists = (username) => {
  return db
    .query(
        `SELECT * 
        FROM users 
        WHERE username = $1`,
        [username]
    ).then(({rows}) => {
       
        if(!rows.length) {
            return Promise.reject({status: 404, msg: "not found"})
        }
    })
};
