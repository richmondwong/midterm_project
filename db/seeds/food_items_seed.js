exports.seed = function(knex, Promise) {

  function deleteFoods() {
    return knex('foods').del()
  }

  function insertFoods() {
    return knex('foods').insert([
      {name:'pepperoni pizza', price: 15.99},
      {name:'salmon sashimi', price: 3.50},
      {name:'eggs benedict', price: 14.50},
      {name:'waffles', price: 8.00},
      {name:'sirloin steak', price: 50.01},
      {name:'poutine', price: 11.11}

    ]).returning('*');
  }

  return deleteFoods()
    .then(insertFoods)

};
