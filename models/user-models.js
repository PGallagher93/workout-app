const db = require("../db/connection");
const { hashPassword } = require("../utils");

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
  const promises = [hashPassword(password)]
  Promise.all(promises).then((resolvedPromises) => {
    console.log(resolvedPromises[0], "yes")
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
