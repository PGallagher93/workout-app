const db = require("../db/connection");
const { checkHashedPassword, hashNewPassword } = require("../utils");
const jwt = require('jsonwebtoken')

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

exports.checkUserPasswordAndLogin = (credentials) => {
  
  const { password, username } = credentials;
  if(!password || !username){
    return Promise.reject({status: 400, msg: "bad request"})
  }
    return db.query(
        `SELECT *
        from users
        WHERE username = $1`,
        [username]
    ).then(({rows}) => {
        
        const userPass = rows[0].password
        const promises = [checkHashedPassword(password, userPass), 
                          rows[0].user_id]
        const userInfo = Promise.all(promises).then((resolvedPromises) =>{
            
            return resolvedPromises
        })
       return userInfo
    }).then((loginResult) => {
      
        if (!loginResult[0]){
           
            return Promise.reject({status:401, msg: "not authorised"})
        }
        //else send token
         const token = jwt.sign({id:loginResult[1], username:username}, process.env.JWT_SECRET)

         return {id: loginResult[1], username, token}
    })
     


};



exports.checkUsernameExists = (credentials) => {
   
    const {username} = credentials
    
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

exports.checkUniqueUsername = (username) => {
    if(username === ""){
        return Promise.reject({status: 400, msg: "bad request"})
    }
    return db
      .query(
        `SELECT *
        FROM users
        WHERE username = $1`,
        [username]
      ).then(({rows}) => {
        if(rows.length){
            return Promise.reject({status: 403, msg: "forbidden"})
        }
      })
}

exports.insertNewUser = (username, password) => {
   

    const promises = [hashNewPassword(password)]

    return Promise.all(promises)
           .then((resolvedPromises) => {
            const hashedPassword = resolvedPromises[0]
            
            return db
                .query(
                    `INSERT into
                     users
                    (username, password)
                    values
                    ($1, $2)
                    returning 
                    username, user_id`,
                    [username, hashedPassword]
                )
           }).then(({rows}) => {
            return rows
           })
}

exports.insertExerciseRecord = (weight, exerciseID, userID) =>{
           
           return db
               .query(
                `INSERT into
                 exercise_records
                 (exercise_id, weight, user_id)
                 VALUES
                 ($1, $2, $3)
                 returning *`,
                 [exerciseID, weight, userID]
               ).then(({rows})=>{
                return rows
               })
}

exports.checkExerciseRecordExists = (id) => {
  return db
          .query(
            `SELECT * 
            FROM exercise_records
            WHERE record_id = $1`,
            [id]
          ).then(({rows})=>{
            if(!rows.length) {
              return Promise.reject({status: 404, msg: "not found"})
          }
          })
}

exports.destroyExerciseRecord = (id) => {
  return db
         .query(
          `DELETE FROM exercise_records
          WHERE record_id = $1`,
          [id]
         )
}

exports.checkUserPasswordAndDestroyUser = (credentials) => {

         const {password, username} = credentials
         console.log(password, username, "creds") 
         if(!password || !username){
          return Promise.reject({status:400, msg:"bad request"})
         }
         
         return db.query(
          `SELECT * 
          FROM users
          WHERE username = $1`,
          [username]
         ).then(({rows})=> {
          
         return checkHashedPassword(password, rows[0].password)
          
         }).then((result)=>{
          
          if(!result){
            return Promise.reject({status: 403, msg:"forbidden"})
          }
          return db.query(
            `DELETE 
             FROM users
             WHERE username = $1`,
             [username]
          )
         })


}