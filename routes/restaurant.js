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
    let orderIdArr = [];
    knex.select('orderid').from('orders')
      .then( (results) => {
        results.forEach( (element) => {
          //SQL query from order# details:
          //SELECT * FROM "ordersFoods" JOIN foods ON "ordersFoods".foodid=foods.foodid WHERE orderid = 7
          knex.select('orderid', 'foods.foodid', 'food.name', 'food_quantity')
            .from('ordersFoods')
            .join('foods', 'foods.foodid', '=', 'ordersFoods.foodid')
            .where('orderid', '=', element.orderid)
            .then((results) => {
              console.log("orders:", results);
            });

        });

        console.log("order query:", results);
      })
      .catch((err) => {
        console.log("Error in order query:", err);
      })


      knex // write query that gets the join table so orders can be seen by restaurant TODO !!!
      .select("*")
      .from('orders')
      .then((results) => {
          const clientOrder = results;

          console.log("this is the clientOrder from knex query that the restuaruant will see: ", clientOrder); //check to see whats actually being returned by query

          const templateVars = {
            order : clientOrder
          };

          return templateVars;
      })
      .then((template) =>{
        //res.render("restaurant_summary", template);
        res.send("sent to restaurant summary page - ejs not ready yet");
      })
      .catch((err)=>{
        console.log("Error @Get Rest Summary: ",err);
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
