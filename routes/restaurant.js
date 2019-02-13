"use strict";

const express = require('express');
const router  = express.Router();
const accountSid;
const authToken;
const client = require('twilio')(accountSid, authToken);
const moment = require('moment-timezone');

module.exports = (knex) => {

  //route to get to restaurant login page (where redirected to if trying to access other page without logging in) STRETCH
  //RENDER Restaurant login page
  router.get("/", (req,res)=>{
    res.render("restaurant");

  });

  //RENDER order summary page for restaurant if login cookie present
  router.get("/summary", (req,res)=>{


    if (!req.cookies.login){
      res.send("must be logged in to view this page")
    } else {
    //SQL query from order# details:
    //SELECT * FROM "ordersFoods"
    //JOIN foods ON "ordersFoods".foodid=foods.foodid
    //JOIN orders ON orders.orderid="ordersFoods".orderid
    //JOIN clients ON clients.clientid=orders.clientid;

     knex.select('orders.orderid', 'clients.name as cname', 'clients.phone_number', 'foods.foodid', 'foods.name', 'food_quantity', 'completed')
      .from('ordersFoods')
      .join('foods', 'ordersFoods.foodid', '=', 'foods.foodid')
      .join('orders', 'ordersFoods.orderid', '=', 'orders.orderid')
      .join('clients', 'clients.clientid', '=', 'orders.clientid')
      .orderBy('orders.orderid', 'desc')
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

        //Create an array of each food object.
        let orderArr = [];
        for(let i in groupedObjects){
          orderArr.push(groupedObjects[i]);
        }

        res.render("restaurant_summary", {orders: orderArr});
      })
      .catch((err) => {
        console.log("Error @query for foods:", err);
      });

    }
});

  //set login cookie and if username and password are correct redirects you to order/summary
  router.post("/", (req, res) => {
    try{
      if( req.body.r_username === 'tester' && req.body.r_pwd === 'testpwd'){
        res.cookie("login", "tester")
        res.redirect("/restaurant/summary")
      } else {
        res.send("Invalid Username or Password")
      }
    } catch (err) {
      console.log("Error @Post restaurant login:", err);
    }
  });

  //Send SMS with prep time
  router.post("/summary", (req, res) => {
    try{
      let orderId = req.body.sms_orderid;
      let prepTime = req.body.prep_time
      let doneTime = moment().tz("America/Toronto").add(prepTime, 'minutes').format('hh:mm a');
      let orderUpdate = {
        completed: doneTime,
        prep_time: prepTime
      };
      //SQL query to get client info with the order.
      //SELECT name,phone_number,orderid FROM orders JOIN clients ON clients.clientid=orders.clientid
      knex('orders').select('name','phone_number','orderid')
        .join('clients','clients.clientid','=','orders.clientid')
        .where('orderid', '=', orderId)
        .then( (results) => {

          let phone = "+1"+ results[0].phone_number;

          client.messages.create(
          {
            body: `Hi ${results[0].name}, your order (#${orderId}) will be ready for pick up in ${prepTime} minutes.`,
            from: '+16475594746',
            to: phone
          }).then(message => console.log(message.sid)).done();

        })


      //Set the order as 'completed' - prep time and completion time saved in DB
      knex('orders').where('orderid', '=', orderId).update(orderUpdate)
        .then( () => {
          res.redirect("/restaurant/summary");
        })


    } catch (err) {
      console.log("Error @Post restaurant/summary:", err);
    }

  });

  return router;
}
