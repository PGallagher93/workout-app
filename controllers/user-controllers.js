const { insertWorkout } = require("../models/workouts-models");
const { checkExerciseExists } = require("../models/exercise-models");
const {
  getExerciseRecordsByUserAndExerciseID,
} = require("../models/exercise-records-models");
const {
  checkUserPasswordAndLogin,
  checkUsernameExists,
  checkUserExists,
  checkUniqueUsername,
  insertNewUser,
  insertExerciseRecord,
  checkExerciseRecordExists,
  destroyExerciseRecord,
  checkUserPasswordAndDestroyUser
} = require("../models/user-models");
const { resolve } = require("path");
exports.postWorkout = (req, res, next) => {
  const workout = req.body;
  const { user_id } = req.params;

  const promises = [checkUserExists(user_id), insertWorkout(workout, user_id)];
  Promise.all(promises)
    .then((resolvedPromises) => {
      
      res.status(201).send({ workout: resolvedPromises[1] });
    })
    .catch(next);
};

exports.getExerciseRecords = (req, res, next) => {
  const { user_id, exercise_id } = req.params;

  const promises = [
    checkUserExists(user_id),
    checkExerciseExists(exercise_id),
    getExerciseRecordsByUserAndExerciseID(exercise_id, user_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      
      res.status(200).send({ exerciseRecords: resolvedPromises[2] });
    })
    .catch(next);
};

exports.postLogin = (req, res, next) => {
  const credentials = req.body;
  
  const promises = [
    checkUsernameExists(credentials),
    checkUserPasswordAndLogin(credentials),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
  
      res.status(200).send({ userDetails: resolvedPromises[1] });
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  
  const { username, password, displayName, avatar } = req.body;
 
  const promises = [
    checkUniqueUsername(username),
    insertNewUser(username, password, displayName, avatar),
  ];

  Promise.all(promises)
  .then((resolvedPromises) => {
    res.status(201).send({userDetails: resolvedPromises[1]})
  }).catch(next)
};

exports.postExerciseRecord = (req, res, next) => {
  
  const {user_id} = req.params
  const {weight, exercise_id} = req.body
  if(!weight|| !exercise_id) {
    res.status(400).send({msg: "bad request"})
  }
 
  const promises = [
    checkUserExists(user_id),
    checkExerciseExists(exercise_id),
    insertExerciseRecord(weight, exercise_id, user_id)
  ]

  Promise.all(promises)
    .then((resolvedPromises) => {
      
      res.status(201).send({recordDetails: resolvedPromises[2][0]})
    }).catch(next)
}

exports.deleteExerciseRecord = (req, res, next) => {
  const {user_id} = req.params
  
  const {record_id} = req.body
  
  if(!record_id){
    
    res.status(400).send({msg: "bad request"})
  }
  const promises = [
    checkUserExists(user_id),
    checkExerciseRecordExists(record_id)
  
   ]
   Promise.all(promises)
          .then(() => {
            destroyExerciseRecord(record_id)
          }).then(()=>{
            res.status(204).send()
          })
          .catch(next)
}

exports.deleteUser = (req, res, next) => {
     const credentials = req.body
    
    
     const promises = [checkUsernameExists(credentials)]

     Promise.all(promises)
            .then(()=>{
              
             return checkUserPasswordAndDestroyUser(credentials)
            })
            .then(()=>{

              res.status(204).send()
            }).catch(next)
     
}