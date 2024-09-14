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
    test("GET 404: returns a 404 status code when given a valid id that is not in the database(user does not exist)", ()=>{
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
describe("GET: /api/user/workouts/:workout_id", () => {
    test("GET 200: returns an array of the workout stats", () =>{
        return request(app)
            .get("/api/user/workouts/1")
            .expect(200)
            .then((res) => {
                const {workout} = res.body
                expect(workout).toHaveLength(6)
                workout.forEach((workoutStats) =>{
                    expect(workoutStats).toHaveProperty("stat_id", expect.any(Number))
                    expect(workoutStats).toHaveProperty("exercise_name", expect.any(String))
                    expect(workoutStats).toHaveProperty("session", expect.any(Number))
                    expect(workoutStats).toHaveProperty("weight", expect.any(Number))
                    expect(workoutStats).toHaveProperty("sets", expect.any(Number))
                    expect(workoutStats).toHaveProperty("reps", expect.any(Number))
                })
            })
    })
    test("GET 404: returns a 404 status code when given a valid workout id that does not exist", () => {
        return request(app)
             .get("/api/user/workouts/999999")
             .expect(404)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("GET 400: returns a 400 status code when given a id of the wrong data type", () => {
        return request(app)
            .get("/api/user/workouts/hello")
            .expect(400)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
            })
    })
})
describe("GET: /api/exercises", () => {
    test("GET 200: returns an array of the available exercises", () =>{
        return request(app)
            .get("/api/exercises")
            .expect(200)
            .then((res) => {
                const {exercises} = res.body
                expect(exercises).toHaveLength(80)
                exercises.forEach((exercise) => {
                    expect(exercise).toHaveProperty("exercise_id", expect.any(Number))
                    expect(exercise).toHaveProperty("exercise_name", expect.any(String))
                    expect(exercise).toHaveProperty("body_part", expect.any(String))
                })
            })
    })
})
describe("POST: /api/users/1/workouts", () =>{
    test("POST 201: returns  a 201 status and posted workout after successfull insertion", ()=>{
        const inputWorkout = {
            workout_name:"My Workout",
            workout_user:1
        }
        return request(app)
           .post("/api/workouts/1")
           .send(inputWorkout)
           .expect(201)
           .then((res) => {
            const {workout} = res.body
            expect(workout[0]).toHaveProperty("workout_id", expect.any(Number))
            expect(workout[0]).toHaveProperty("workout_name", expect.any(String))
            expect(workout[0]).toHaveProperty("workout_user", expect.any(Number))
            expect(workout[0]).toHaveProperty("is_premade", expect.any(Boolean))
           }) 

           
    })
    test("POST 404: returns a 404 status code when given an id that doesnt exist in the database", ()=>{
        const inputWorkout = {
            workout_name:"My Workout"
        }
        return request(app)
            .post("/api/workouts/9999")
            .expect(404)
            .send(inputWorkout)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("not found")
            })
    })
    test("POST 400: returns a 400 status code and bad request message when given an id of an invalid type", () => {
        const inputWorkout = {
            workout_name:"My Workout"
        }
        return request(app)
            .post("/api/workouts/hello")
            .expect(400)
            .send(inputWorkout)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
            })
    })
    test("POST 400: returns a 400 status code and a bad request message if no workout is sent", ()=>{
        return request(app)
            .post("/api/workouts/1")
            .expect(400)
            .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("bad request")
            })
    })
    test("POST 400: returns a 400 status code and a bad request message if given the wrong key name in request body", () =>{
        const inputWorkout = {
            workout:3
        }
        return request(app)
            .post("/api/workouts/1")
            .send(inputWorkout)
            .expect(400)
            .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
            })
    })
})

describe("POST: /api/workouts/workout_stats/:workout_id", () => {
    test("POST 201: returns a 201 status code and posted workout stats after successful insertion", () => {
        const inputStats = [
            {exercise_id: 1,
            weight: 40,
            sets: 4,
            reps: 5, 
            session: 4,},
            {exercise_id:31,
             weight: 23,
             sets: 4,
             reps: 4,
             session:5}
        ]

        return request(app)
            .post("/api/workouts/workout_stats/1")
            .send(inputStats)
            .expect(201)
            .then((res)=>{
                const {workoutStats} = res.body
                
                expect(workoutStats).toHaveLength(2)
                workoutStats.forEach((stat) =>{
                    expect(stat).toHaveProperty("stat_id", expect.any(Number))
                    expect(stat).toHaveProperty("exercise_id", expect.any(Number))
                    expect(stat).toHaveProperty("weight", expect.any(Number))
                    expect(stat).toHaveProperty("sets", expect.any(Number))
                    expect(stat).toHaveProperty("reps", expect.any(Number))
                    expect(stat).toHaveProperty("session", expect.any(Number))
                    expect(stat).toHaveProperty("workout_id", expect.any(Number))
                })
            })
    })
    test("POST 404: returns 404 status code when given a valid workout id that doesnt exist", ()=>{
        const inputStats = [
            {exercise_id: 1,
            weight: 40,
            sets: 4,
            reps: 5, 
            session: 4,},
            {exercise_id:31,
             weight: 23,
             sets: 4,
             reps: 4,
             session:5}
        ]
              
        return request(app)
             .post("/api/workouts/workout_stats/99999")
             .expect(404)
             .send(inputStats)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("POST 400: returns a 400 status code when given a id of the wrong data type", ()=>{
        const inputStats = [
            {exercise_id: 1,
            weight: 40,
            sets: 4,
            reps: 5, 
            session: 4,},
            {exercise_id:31,
             weight: 23,
             sets: 4,
             reps: 4,
             session:5}
        ]
        return request(app)
              .post("/api/workouts/workout_stats/hello")
              .expect(400)
              .send(inputStats)
              .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
              })
    })
    test("POST 400: returns a 400 status code when given an input with the wrong data type", ()=>{
        const inputStats = [
            {exercise_id: "ello",
            weight: 40,
            sets: 4,
            reps: 5, 
            session: 4,},
            {exercise_id:31,
             weight: 23,
             sets: 4,
             reps: 4,
             session:5}
        ]
        return request(app)
              .post("/api/workouts/workout_stats/1")
              .send(inputStats)
              .expect(400)
              .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
              })
    })
    test("POST 400: returns a 400 status code when given an empty input", ()=>{
        const inputStats = {}
        return request(app)
              .post("/api/workouts/workout_stats/1")
              .send(inputStats)
              .expect(400)
              .then(({body})=>{
                const {msg} = body
                expect(msg).toBe("bad request")
              })
    })

})

describe("GET: /api/user/:user_id/exercise_records/:exercise_id", () =>{
    test("GET 200: returns an array of the exercise records", () =>{
        return request(app)
             .get("/api/user/1/exercise_records/1")
             .expect(200)
             .then((res)=>{
                const {exerciseRecords} = res.body
                
                expect(exerciseRecords).toHaveLength(2)
                exerciseRecords.forEach((exerciseRecord)=>{
                    expect(exerciseRecord).toHaveProperty("record_id", expect.any(Number))
                    expect(exerciseRecord).toHaveProperty("exercise_id", expect.any(Number))
                    expect(exerciseRecord).toHaveProperty("weight", expect.any(Number))
                    expect(exerciseRecord).toHaveProperty("created_at", expect.any(String))
                    expect(exerciseRecord).toHaveProperty("user_id", expect.any(Number))
                })
             })
    })
    test("GET 404: returns a 404 status code when given a valid user ID that doesnt exist", ()=>{
        return request(app)
             .get("/api/user/9999/exercise_records/1")
             .expect(404)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("GET 404: returns a 404 status code when given a exercise ID that doesnt exist", ()=>{
        return request(app)
             .get("/api/user/1/exercise_records/9999")
             .expect(404)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("GET 404: returns a 400 status code when given a valid user ID that has no exercise records available", ()=>{
        return request(app)
             .get("/api/user/2/exercise_records/1")
             .expect(404)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("GET 404: returns a 404 status code when given a valid exercise ID for which the user has no records", ()=>{
        return request(app)
             .get("/api/user/1/exercise_records/5")
             .expect(404)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("not found")
             })
    })
    test("GET 400: returns a 400 status code when given a user ID of an invalid type", ()=>{
        return request(app)
             .get("/api/user/hello/exercise_records/1")
             .expect(400)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("bad request")
             })
    })
    test("GET 400: returns a 400 status code when given a exercise ID of an invalid type", ()=>{
        return request(app)
             .get("/api/user/1/exercise_records/ello")
             .expect(400)
             .then(({body}) => {
                const {msg} = body
                expect(msg).toBe("bad request")
             })
    })
    
})
describe("POST: /api/user/login", () => {
    test.only("POST 201: returns a 201 status code", () =>{
        const inputCredentials = [{
            password: "TheEmperorSucks",
            username:"Kharn"
        }]

        return request(app)
            .post("/api/user/login")
            .send(inputCredentials)
            .expect(201)
    })
})