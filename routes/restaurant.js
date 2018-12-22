"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  //route to get to restaurant login page (where redirected to if trying to access other page without logging in) STRETCH
  //RENDER Restaurant login page
  router.get("/", (req,res)=>{
    res.render("restaurant");
    //res.send("sent to restaurant 'login' page - ejs not ready yet.")
  });

  //RENDER order summary page for restaurant
  router.get("/summary", (req,res)=>{



    //SQL: Grab all order ids
    //SELECT orderid FROM orders;
    knex.select('orderid').from('orders')
      .then( (results) => {
        let orderIdArr = [];

        results.forEach( (item) => {
          orderIdArr.push(item['orderid']);
        });

        //console.log("orderid results:", orderIdArr);

        //SQL query from order# details:
        //SELECT * FROM "ordersFoods"
        //JOIN foods ON "ordersFoods".foodid=foods.foodid
        //JOIN orders ON orders.orderid="ordersFoods".orderid
        //JOIN clients ON clients.clientid=orders.clientid;

        //SELECT * FROM "ordersFoods" JOIN foods ON "ordersFoods".foodid=foods.foodid WHERE orderid = 7
        knex.select('orders.orderid', 'clients.name as cname', 'clients.phone_number', 'foods.foodid', 'foods.name', 'food_quantity')
          .from('ordersFoods')
          .join('foods', 'ordersFoods.foodid', '=', 'foods.foodid')
          .join('orders', 'ordersFoods.orderid', '=', 'orders.orderid')
          .join('clients', 'clients.clientid', '=', 'orders.clientid')
          //.whereIn('orderid', orderIdArr)
          .then( (orders) => {

            //create an Object {orderid: [{food data},{food data},...] }
            let groupedObjects = {};
            for(let i in orders) {

              if( groupedObjects[orders[i]['orderid']] ){
                groupedObjects[orders[i]['orderid']].push(orders[i]);
              }
              else {
                groupedObjects[orders[i]['orderid']] = [orders[i]];
              }
            }
            console.log("temp:", groupedObjects);
            res.render("restaurant_summary", {orders:groupedObjects});
          })
          .catch((err) => {
            console.log("Error @query for foods:", err);
          });

      })

      .catch((err) => {
        console.log("Error in order query:", err);
      })

  });

  router.post("/", (req, res) => {
    try{
      res.redirect("/restaurant/summary");
    } catch (err) {
      console.log("Error @Post restaurant login:", err);
    }
  });

 return router;
}
