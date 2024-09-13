const bcrypt = require('bcrypt')

exports.addExerciseID = (exerciseData) =>{
    
    let count = 1
    let formattedData = exerciseData.map((exercise) => {
        exercise.exercise_id = count
        count ++
        return exercise
    })
    
    return formattedData
}

exports.findExerciseID = (data, formattedExerciseData) => {
    let formattedData = data.map((workout) => {
        
        formattedExerciseData.forEach((exercise) => {
            
            if(exercise.exercise_name === workout.exercise_name){
                
                workout.exercise_id = exercise.exercise_id
            }
            
        })
        return workout
    })
    return formattedData
}
exports.hashPassword = (userData) => {
       const hashedUsers = userData.map((user) => {
        
        return user.password = bcrypt.hash(user.password, 10)
       })
       return Promise.all(hashedUsers)
}