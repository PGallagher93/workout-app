const {Pool }= require("pg")

const ENV = "development"
require('dotenv').config({
    path:`${__dirname}/../.env.${ENV}`
})

if (!process.env.PGDATABASE){
    throw new Error("Bloomin' 'eck, guv'nor, aint no PGDATABASE 'ere")
}
const config={}
module.exports = new Pool(config)