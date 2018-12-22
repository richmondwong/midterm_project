
exports.seed = async function(knex, Promise) {

  function deleteFoods() {
    return knex('foods').del()
  }

  function deleteClients() {
    return knex('clients').del()
  }

  function deleteOrders() {
    return knex('orders').del()
  }

  function deleteOrdersFoods() {
    return knex('ordersFoods').del()
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

  function insertClients() {
    return knex('clients').insert([
      {name:'Gordon Ramses', phone_number: 6475049239},
      {name:'Jamie Oliver', phone_number: 6475049239}

    ]).returning('*');
  }

  function insertOrders(clients) {
    return knex('orders').insert([
      {prep_time: 30, total_price: 100.00, clientid: clients[0].clientid},
      {prep_time: 45, total_price: 122.25, clientid: clients[1].clientid}
    ]).returning('*');
  }

  function insertOrdersFoods(orders, foods) {
    return knex('ordersFoods').insert([
      {orderid: orders[0].orderid, foodid: foods[0].foodid, food_quantity: 1},
      {orderid: orders[0].orderid, foodid: foods[1].foodid, food_quantity: 2},
      {orderid: orders[0].orderid, foodid: foods[2].foodid, food_quantity: 4},
      {orderid: orders[0].orderid, foodid: foods[3].foodid, food_quantity: 6},
      {orderid: orders[1].orderid, foodid: foods[4].foodid, food_quantity: 6},
      {orderid: orders[1].orderid, foodid: foods[5].foodid, food_quantity: 7},
      {orderid: orders[1].orderid, foodid: foods[1].foodid, food_quantity: 8}

    ])
  }

  await deleteOrdersFoods()
    .then(deleteOrders)
    .then(deleteClients)
    .then(deleteFoods)

    const foods = await insertFoods();
    //.then(insertFoods)
    const clients = await insertClients();
    const orders = await insertOrders(clients);
    const ordersFoods = await insertOrdersFoods(orders, foods);

    // .then(insertClients)
    // .then(clients => insertOrders(clients))
    // .then((orders, foods) => insertOrdersFoods(orders, foods))

};
