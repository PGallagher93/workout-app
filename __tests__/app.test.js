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

describe("GET: /api/workouts", () => {
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

describe("GET: /api/workouts/:user_id", ()=>{
    test("GET 200: returns an array of the users workouts", ()=>{
        return request(app)
            .get("/api/workouts/1")
            .expect(200)
            .then((res) => {
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
    test("GET 404: returns a 404 status code wen given a valid id that is not in the database(user does not exist)", ()=>{
        return request(app)
            .get("/api/workouts/9999")
            .expect(404)
            .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
            })
    })
    test("GET 400: returns a 400 status code when given a id of invalid type", () => {
        return request(app)
            .get("/api/workouts/hello")
            .expect(400)
            .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("bad request")
            })
    })
})