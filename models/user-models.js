const db = require("../db/connection")

exports.checkUserExists = (id) => {
    return db
        .query(
            `SELECT * 
               FROM users
                WHERE user_id = $1`, 
                [id]
        ).then(({rows}) => {
            if(!rows.length) {
                return Promise.reject({status: 404, msg: "not found"})
            }
        })
       
}

