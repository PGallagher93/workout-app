const { checkUserExists } = require("../models/user-models");
const {
  readPremadeWorkouts,
  findWorkoutsByUserID,
  checkWorkoutExists,
  findWorkoutStatsByWorkoutID,
  insertWorkoutStats
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
   console.log(req. body, "< req body")
  const promises = [
    insertWorkoutStats(workout_id),
    checkWorkoutExists(workout_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      console.log(resolvedPromises);
    })
    .catch(next);
};
