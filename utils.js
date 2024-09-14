const bcrypt = require('bcrypt')

exports.checkPassword = (credentials) =>{

}
exports.checkHashedPassword = (password, userPass) => {
    
    

   
     return  bcrypt.compare(password, userPass)
    
}

