
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('orders', function(table){
      table.dropColumn('completed');
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.string('completed');
      })
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('orders', function(table){
      table.dropColumn('completed');
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.integer('completed');
      })
    })

  ])
};
