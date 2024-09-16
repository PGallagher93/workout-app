const bcrypt = require('bcrypt')


exports.checkHashedPassword = (password, userPass) => {
    
    console.log(password, userPass, "in hash")

   
     return  bcrypt.compare(password, userPass)
    
}

