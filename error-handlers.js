exports.handleCustomErrors = (err, req, res, next) => {
    console.log(err, "custom")
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    }
    else {
        
        next(err)
    }
}

exports.handleErrors = (err, req, res, next) => {
    console.log(err, "< error")
    if(err.code = '22P02'){
        res.status(400).send({msg : "bad request"})
    }
    next(err)
}