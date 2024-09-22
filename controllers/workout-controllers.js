const { checkUserExists } = require("../models/user-models");
const {
  readPremadeWorkouts,
  findWorkoutsByUserID,
  checkWorkoutExists,
  findWorkoutStatsByWorkoutID,
  insertWorkoutStats,
  checkWorkoutStatExists,
  updateWorkoutStat,
  destroyWorkoutStat
} = require("../models/workouts-models");

exports.getPremadeWorkouts = (req, res, next) => {
  readPremadeWorkouts().then((data) => {
    return res.status(200).send({ workouts: data });
  });
};

exports.getWorkoutsByUserID = (req, res, next) => {
  const { user_id } = req.params;

  const promises = [findWorkoutsByUserID(user_id), checkUserExists(user_id)];

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(200).send({ workouts: resolvedPromises[0] });
    })
    .catch(next);
};

exports.getWorkoutStatsByWorkoutID = (req, res, next) => {
  const { workout_id } = req.params;

  const promises = [
    findWorkoutStatsByWorkoutID(workout_id),
    checkWorkoutExists(workout_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(200).send({ workout: resolvedPromises[0] });
    })
    .catch(next);
};

exports.postWorkoutStats = (req, res, next) => {
  const { workout_id } = req.params;
  
  const stats = req.body
  const promises = [
    checkWorkoutExists(workout_id),
    insertWorkoutStats(stats, workout_id)
  ];


Promise.all(promises)
       .then((resolvedPromises) => {
        
        res.status(201).send({workoutStats: resolvedPromises[1]})
       }).catch(next)
};

exports.patchWorkoutStats = (req, res, next) => {
  const stats = req.body
  
  const {stat_id, weight} = stats

  if(!stat_id || !weight) {
    res.status(400).send({msg: "bad request"})
  }

  
  const promises = [
    checkWorkoutStatExists(stat_id),
    updateWorkoutStat(stat_id, weight)
  ]

  Promise.all(promises)
         .then((resolvedPromises) => {
          
          res.status(200).send({workoutStat: resolvedPromises[1][0]})
         }).catch(next)
}

exports.deleteWorkoutStat = (req, res, next) => {
  const stat = req.body
  const {workout_id} = req.params 

  const {stat_id} = stat
  if(!stat_id){
    res.status(400).send({msg: "bad request"})
  }

  const promises = [
    checkWorkoutStatExists(stat_id),
    checkWorkoutExists(workout_id)
  ]
  Promise.all(promises)
         .then(() => {
          destroyWorkoutStat(stat_id)
         })
          .then(() =>{
            res.status(204).send()
          })
         .catch(next)
}