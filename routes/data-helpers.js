//knex setup
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: "localhost",
    user: "labber",
    password: "labber",
    database : "midterm"
  }
});

// Defines helper functions
module.exports = function makeDataHelpers() {
  return {

    // Get all tweets in `db`, sorted by newest first
    getFoods: function(callback) {
      knex.select().from('foods')
       .then((rows) => {
          console.log(rows);
          callback(null, rows);
       })
       .finally(() => {
              knex.destroy();
          })
      ;
    }


  };
}
