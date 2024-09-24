const bcrypt = require('bcrypt')


exports.checkHashedPassword = (password, hashedPassword) => {
    
   

   
     return  bcrypt.compare(password, hashedPassword)
    
}

exports.hashNewPassword = (password) => {
    
   
    return bcrypt.hash(password, 10)
    
    
}
