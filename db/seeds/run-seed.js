const seed = require("../seeds/seed")
const db = require("../connection")
const testData = require("../test-data/index")

seed(testData).then(()=>{
    return db.end()
})