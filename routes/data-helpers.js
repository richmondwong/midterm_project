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

// Get all tweets in `db`, sorted by newest first
function getFoods() {
  knex.select().from('foods')
   .then((rows) => {
      console.log(rows);
      return(rows);
   })
   .finally(() => {
          knex.destroy();
      })
  ;
}

module.exports = {
  getFoods: getFoods

};
