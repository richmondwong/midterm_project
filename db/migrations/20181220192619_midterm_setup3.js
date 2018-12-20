
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('clients', function(table){
      table.dropColumn('phone_number');
    }).then(data => {
      return knex.schema.table('clients', table => {
        table.string('phone_number');
      })
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('clients', function(table){
      table.dropColumn('phone_number');
    }).then(data => {
      return knex.schema.table('clients', table => {
        table.integer('phone_number');
      })
    })

  ])
};
