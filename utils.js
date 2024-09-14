const bcrypt = require('bcrypt')

exports.checkPassword = (credentials) =>{

}
exports.hashPassword = (password) => {
    
    

   
     return  bcrypt.hash(password, 10)
    
}

