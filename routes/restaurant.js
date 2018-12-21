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

    let orderIdArr = [];
    let templateVars = {};


    //SQL: Grab all order ids
    //SELECT orderid FROM orders;
    knex.select('orderid').from('orders')
      .then( (results) => {
        results.forEach( (item) => {
          orderIdArr.push(item['orderid']);
        });
        console.log("orderid results:", orderIdArr);
        //SQL query from order# details:
        //SELECT * FROM "ordersFoods" JOIN foods ON "ordersFoods".foodid=foods.foodid WHERE orderid = 7
        knex.select('orderid', 'foods.foodid', 'foods.name', 'food_quantity')
          .from('ordersFoods')
          .join('foods', 'ordersFoods.foodid', '=', 'foods.foodid')
          .whereIn('orderid', orderIdArr)
          .then((results) => {
            templateVars = results;
            //console.log("templateVars Data:", templateVars);
            return templateVars;
          })
          .then( (templateVars) => {
            console.log("temp:", templateVars);
            res.render("restaurant_summary", {orders:templateVars});
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
