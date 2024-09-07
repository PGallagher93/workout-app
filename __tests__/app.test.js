const app = require("../app")
const seed = require("../db/seeds/seed")
const testData = require("../db/test-data/index")
const request = require("supertest")
const db = require("../db/connection")
const endpointData = require("../endpoints.json")

beforeEach(()=>{
    return seed(testData)
})
afterAll(()=>{
    return db.end()
})

describe("GET: /api", ()=>{
    test("GET 200: returns a JSON object containting requred API endpoint data", ()=>{
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                const endpoints = response.body

                expect(endpoints).toEqual(endpointData)
            })
    })
})

describe("GET: /api/premades", () => {
    test("GET 200: returns an array showing the premade workouts", () => {
        return request(app)
            .get("/api/premades")
            .expect(200)
            .then((res) =>{
                const {workouts} = res.body
                expect(workouts).toHaveLength(2)
                workouts.forEach((workout) => {
                    expect(workout).toHaveProperty("workout_id", expect.any(Number))
                    expect(workout).toHaveProperty("workout_name", expect.any(String))
                    expect(workout).toHaveProperty("workout_user", expect.any(Number))
                    expect(workout).toHaveProperty("is_premade", expect.any(Boolean))
                })

            })
 
            
    })
})