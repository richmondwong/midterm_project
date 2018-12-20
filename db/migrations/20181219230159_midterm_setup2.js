
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('foods', function(table){
      table.dropColumn('price');
    }).then(data => {
      return knex.schema.table('foods', table => {
        table.decimal('price');
      })
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.dropColumn('total_price');
      })
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.decimal('total_price');
      })
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('foods', function(table){
      table.dropColumn('price');
    }).then(data => {
      return knex.schema.table('foods', table => {
        table.integer('price');
      })
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.dropColumn('total_price');
      })
    }).then(data => {
      return knex.schema.table('orders', table => {
        table.integer('total_price');
      })
    })

  ])
};
