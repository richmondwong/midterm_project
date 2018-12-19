
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('clients', table => {
        table.increments('clientid').primary();
        table.string('name');
        table.integer('phone_number');
    }).then(data => {
      return knex.schema.createTable('foods', table => {
        table.increments('foodid').primary();
        table.string('name');
        table.integer('price');
      })
    }).then(data => {
      return knex.schema.createTable('orders', table => {
        table.increments('orderid').primary();
        table.integer('prep_time');
        table.integer('total_price');
        table.integer('completed');
        table.integer('clientid').references('clientid').inTable('clients');
      })
    }).then(data => {
      return knex.schema.createTable('ordersFoods', table => {
        table.integer('food_quantity');
        table.integer('orderid').references('orderid').inTable('orders');
        table.integer('foodid').references('foodid').inTable('foods');
      })
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ordersFoods'),
    knex.schema.dropTable('orders'),
    knex.schema.dropTable('foods'),
    knex.schema.dropTable('clients')
  ])
};
