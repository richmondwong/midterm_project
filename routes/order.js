"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  //RENDER order confirm page
  router.get("/confirm", (req,res) =>{

    // knex // write query that gets the join table TODO !!!
    //   .select('*')
    //   .from('orders')
    //   .where('orderid', '=', NewOrderId)
    //   .then((results) => {
    //       const clientOrder = results;

    //       console.log("this is the clientOrder from knex query: ", clientOrder); //check to see whats actually being returned by query

    //       const templateVars = {
    //         order : clientOrder
    //       };


    //       return templateVars;
      // })
      // .then((template) =>{
        //res.render("order_id", template);
        res.send("sent to order confirmation page - EJS not ready yet");
      // })
      // .catch((err)=>{
      //   console.log("Error @GET order/confirm: ",err);
      // })
  })

  //RENDER Final orders page - confirm restaurant recived order.
  router.get("/final", (req,res)=>{
    try {
      //res.render("order_confirm");
      res.send("sent to order final page - ejs not ready");
    } catch (err){
      console.log("Error @GET order/final:", err);
    }

  })

  //GRAB data from cookie and send to confirmation page
  router.post("/", (req, res) => {
    try {
      //get order data.

      let cookieData = {
        food1: {id: req.body.f1id, quntity: req.body.f1q},
        food2: {id: req.body.f2id, quntity: req.body.f2q},
        food3: {id: req.body.f3id, quntity: req.body.f3q},
        food4: {id: req.body.f4id, quntity: req.body.f4q},
        food5: {id: req.body.f5id, quntity: req.body.f5q},
        food6: {id: req.body.f6id, quntity: req.body.f6q},
        name : req.body.customer_name,
        phone : req.body.phone_number
      };
      console.log("cookie data:",cookieData);

      //send cookie with order data.
      res.cookie("cart", cookieData, { expires: new Date(Date.now() + 900000)});

      //redirect to comfirmation page.
      //res.redirect("/order/confirm");
      res.send("POSTED, check for cookie");
    } catch (err){
      console.log("Error @ post /order:", err);
    }

  });

  //GRAB data from cookie, INSERT to DB
  router.post("/confirm", (req, res) => {
    try {
      //grab data from cookie.
      let orderObj = req.cookies;

      //input the data to the db
      let newClient = [{
        name: orderObj.name,
        phone_number: orderObj.phone
      }];
      let clientId;
      let orderId;

      knex('clients').insert(newClient)
        .then( () => {
          clientId = knex('clients').select(clientid).orderBy('clientid', 'desc').limit(1);
          return clientid;
        })
        .then( (id) => {
          let newOrder = {
            clientid: id
          };

          knex('orders').insert(newOrder);
        })
        .then( () => {
          orderId = knex('orders').select(orderid).orderBy('orderid', 'desc').limit(1);
          knex('ordersFoods').insert({ orderid: orderId,
                                        foodid: orderObj[food1][id],
                                        food_quantity: orderObj[food1][f1q]});
          knex('ordersFoods').insert({ orderid: orderId,
                                        foodid: orderObj[food2][id],
                                        food_quantity: orderObj[food2][f2q]});
          knex('ordersFoods').insert({ orderid: orderId,
                                        foodid: orderObj[food3][id],
                                        food_quantity: orderObj[food3][f3q]});
        })

        res.send("confirmation complete - to redirect to final page");
    } catch (err) {
      console.log("Error @POST /order/confirm:", err);
    }

  });

 return router;
}
