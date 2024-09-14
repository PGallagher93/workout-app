const bcrypt = require('bcrypt')


exports.checkHashedPassword = (password, userPass) => {
    
    

   
     return  bcrypt.compare(password, userPass)
    
}

