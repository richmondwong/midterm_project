"use strict";

const express = require('express');
const router  = express.Router();

const accountSid = 'AC179754f7af01989ecab3b52a6b9755be';
const authToken = '913da9bf2a42df203863cd3644ca928f';
const client = require('twilio')(accountSid, authToken);

module.exports = (knex) => {

  //RENDER order confirm page
  router.get("/confirm", (req,res) =>{

    var cart = req.cookies.cart;

    if(!cart){
      res.redirect("/")
    } else {

      let templateVars = {
      name : cart.name,
      phone: cart.phone,
      foodOrder : cart.foodOrder,
      totalPrice : cart.totalPrice
      }

      console.log("this is template Vars food order", templateVars.foodOrder)
      res.render("order_confirm", templateVars);
    }

  })



  //GRAB data from main page and set basket as cookie, redirect to /confirm page
  router.post("/confirm", (req, res) => {

    const orderObj = (req.body);
    console.log(orderObj);

    const cookieCustomerObj = {
      customerName : orderObj.customer_name,
      customerPhone: orderObj.phone_number,
      customerTotalPrice: orderObj.food_basket_total
    }

    let cookieFoodItems = orderObj.food_basket_item;

    const foodOrder = []

    for (foodItem of cookieFoodItems){
      foodOrder.push(JSON.parse(foodItem))
    }

    console.log("this is the customer info: ", cookieCustomerObj);
    console.log("this is the food info: ", foodOrder);

    const cart = {
      name : cookieCustomerObj.customerName,
      phone : cookieCustomerObj.customerPhone,
      foodOrder : foodOrder,
      totalPrice : cookieCustomerObj.customerTotalPrice
    }

    res.cookie("cart", cart)
    console.log("this is the cart object: ", cart)


    res.redirect("/order/confirm");
});

 // post from /confirm page that sends cookie data into relvent DB tables and sends text to restaurant
router.post("/send", (req, res) => {

    var cart = req.cookies.cart

    console.log("this is the final cart:", cart)

    let finalCart = {
      name : cart.name,
      phone: cart.phone,
      foodOrder : cart.foodOrder,
      totalPrice : cart.totalPrice
    }

    var arrayForDB = []
      for (item of finalCart.foodOrder){
          var orderItem = {
            foodid: item.id,
            food_quantity: item.quantity
          }
          arrayForDB.push(orderItem)
      }

    console.log("this is the array that will go into knex", arrayForDB)


    knex("clients")
      .insert({name: finalCart.name, phone_number: finalCart.phone})
      .returning('clientid')
      .then(function (response) {
          knex('orders')
            .insert({clientid: response[0], total_price: finalCart.totalPrice})
            .returning('orderid')
            .then(function(response){
              for (item of arrayForDB){
                item.orderid = response[0]
              }

              knex('ordersFoods')
               .insert(arrayForDB)
               .then(res.redirect("/order/final"))
            })
      });


    function foodExtractor (input) {

      var foodOrderString = "";

      for (var i in input.cart.foodOrder){
        console.log("This is the name: ", req.cookies.cart.foodOrder[i]["name"])
        var name = req.cookies.cart.foodOrder[i]["name"];
        foodOrderString += `Item: ${name}\n`
        console.log("This is the quantity: ", req.cookies.cart.foodOrder[i]["quantity"])
        var quantity = req.cookies.cart.foodOrder[i]["quantity"];
        foodOrderString += `Quantity: ${quantity}\n`
      }
      return foodOrderString
    }

      client.messages.create(
      {
        body: `\n\n Customer Name: ${req.cookies.cart.name} \n\nFood Order: \n${foodExtractor(req.cookies)} \nPhone: ${req.cookies.cart.phone} \n\nTotal Price: $${req.cookies.cart.totalPrice}`,
        from: '+16475594746',
        to: '+14167958562'
      }).then(message => console.log(message.sid)).done();


  });

//HELPER function to get cart data from cookie and return cart data in an object w/ structure:
  // { name         : 'Stan3',
  //   phone        : '4168763021',
  //   foodOrder    :
  //                  [ { id: 73, name: 'pepperoni pizza', price: 15.99, quantity: 2 },
  //                    { id: 74, name: 'salmon sashimi', price: '3.50', quantity: 1 } ],
  //   totalPrice   : '35.48' }
  function getCart(req){

    let cart = req.cookies.cart;
    if (!cart){
      return (false);
    }
    else {
      //console.log("cookie: ", cart);
      let finalCart = {
        name : cart.name,
        phone: cart.phone,
        foodOrder : cart.foodOrder,
        totalPrice : cart.totalPrice
      }
      return (finalCart);
    }

  }

  //RENDER the final page after customer confirms their order.
  router.get("/final", (req, res) => {

      try {
        let cart = getCart(req);
        if(!cart){
          res.redirect("/")
        }
        else {
          res.clearCookie('cart');
          res.render("order_final", cart);
        }
      } catch (err) {
        console.log("Error @Get final:", err);
      }
  });

  return router;
}


