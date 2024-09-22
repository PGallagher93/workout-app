const bcrypt = require('bcrypt')


exports.checkHashedPassword = (password, userPass) => {
    
   

   
     return  bcrypt.compare(password, userPass)
    
}

exports.hashNewPassword = (password) => {
    
   
    return bcrypt.hash(password, 10)
    
    
}
