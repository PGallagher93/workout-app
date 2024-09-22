const db = require("../db/connection");
const format = require('pg-format')
exports.readPremadeWorkouts = () => {
  let queryString = `SELECT * FROM workouts WHERE is_premade = true`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.findWorkoutsByUserID = (id) => {
  return db
    .query(
      `SELECT *
                FROM workouts
                WHERE workout_user = $1`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.findWorkoutStatsByWorkoutID = (id) => {
  return db
    .query(
      `SELECT workout_stats.stat_id, exercises.exercise_name, workout_stats.session,
                     workout_stats.weight, workout_stats.sets, workout_stats.reps 
                     FROM workout_Stats 
                     INNER JOIN exercises ON workout_stats.exercise_id = exercises.exercise_id 
                     WHERE workout_stats.workout_id = $1 
                     ORDER BY workout_stats.session`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkWorkoutExists = (id) => {
  return db
    .query(
      `SELECT *
                FROM workouts
                WHERE workout_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.insertWorkout = ({ workout_name }, id) => {
  return db
    .query(
      `INSERT INTO workouts
             (workout_name, workout_user) 
             VALUES
             ($1, $2)
             returning *`,
      [workout_name, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertWorkoutStats = (stats, id) => {
    // add the workout id to the stats objects
         const values = stats.map((stat) => {
            stat.workout_id = id
            return stat
         })
         //format the workout stats into a nested array of the stat values
         const formattedValues = []
         values.forEach((value) => {
            const valueArray = []
            for( const stat in value){
                
                valueArray.push(value[stat])
            }
            formattedValues.push(valueArray)
         })
         
        return db
            .query(format(
                `INSERT INTO workout_stats 
                (exercise_id, weight, sets, reps, session, workout_id)
                 VALUES
                 %L
                 returning *`,
                formattedValues)
                
                )
                .then(({rows}) => {
                   
                    return rows
                })
    
    

}

exports.checkWorkoutStatExists = (id) => {

  return db
      .query(
        `SELECT * 
        FROM
        workout_stats
        WHERE 
        stat_id = $1
        `, 
        [id]
      ).then(({rows})=> {
        if(!rows.length) {
          return Promise.reject({status:404, msg: "not found"})
        }
      })
}

exports.updateWorkoutStat = (id, weight) => {

    return db
         .query(
          `UPDATE workout_stats
          SET weight = $1
          WHERE stat_id = $2
          returning *`,
          [weight, id]
         ).then(({rows}) => {
          return rows
         })

}