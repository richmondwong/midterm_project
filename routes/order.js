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


    // res.render("order_confirm")


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


    // knex // write query that gets the join table TODO !!!
    //   .select('*')
    //   .from('orders')
    //   .where('orderid', '=', NewOrderId)
    //   .then((results) => {
    //       const clientOrder = results;

    //       console.log("this is the clientOrder from knex query: ", clientOrder); //check to see whats actually being returned by query

    //       const templateVars = {
    //         order : clientOrder

    // const cart = {
    //   name : cookieCustomerObj.customerName,
    //   phone : cookieCustomerObj.customerPhone,
    //   foodOrder : foodOrder,
    //   totalPrice : cookieCustomerObj.customerTotalPrice
    // }
    //       };


    //       return templateVars;
      // })
      // .then((template) =>{
        //res.render("order_id", template);
      // })
      // .catch((err)=>{
      //   console.log("Error @GET order/confirm: ",err);
      // })
  })



  //GRAB data from cookie and send to confirmation page
  // router.post("/", (req, res) => {
  //   try {
  //     //get order data.

  //     let cookieData = {
  //       food1: {id: req.body.f1id, quntity: req.body.f1q},
  //       food2: {id: req.body.f2id, quntity: req.body.f2q},
  //       food3: {id: req.body.f3id, quntity: req.body.f3q},
  //       food4: {id: req.body.f4id, quntity: req.body.f4q},
  //       food5: {id: req.body.f5id, quntity: req.body.f5q},
  //       food6: {id: req.body.f6id, quntity: req.body.f6q},
  //       name : req.body.customer_name,
  //       phone : req.body.phone_number
  //     };
  //     console.log("cookie data:",cookieData);

  //     //send cookie with order data.
  //     res.cookie("cart", cookieData, { expires: new Date(Date.now() + 900000)});

  //     //redirect to comfirmation page.
  //     //res.redirect("/order/confirm");
  //     res.send("POSTED, check for cookie");
  //   } catch (err){
  //     console.log("Error @ post /order:", err);
  //   }

  // });

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
    // try {
      //grab data from cookie.
    //   let orderObj = req.cookies;

    //   //input the data to the db
    //   let newClient = [{
    //     name: orderObj.name,
    //     phone_number: orderObj.phone
    //   }];
    //   let clientId;
    //   let orderId;

    //   knex('clients').insert(newClient)
    //     .then( () => {
    //       clientId = knex('clients').select(clientid).orderBy('clientid', 'desc').limit(1);
    //       return clientid;
    //     })
    //     .then( (id) => {
    //       let newOrder = {
    //         clientid: id
    //       };

    //       knex('orders').insert(newOrder);
    //     })
    //     .then( () => {
    //       orderId = knex('orders').select(orderid).orderBy('orderid', 'desc').limit(1);
    //       knex('ordersFoods').insert({ orderid: orderId,
    //                                     foodid: orderObj[food1][id],
    //                                     food_quantity: orderObj[food1][f1q]});
    //       knex('ordersFoods').insert({ orderid: orderId,
    //                                     foodid: orderObj[food2][id],
    //                                     food_quantity: orderObj[food2][f2q]});
    //       knex('ordersFoods').insert({ orderid: orderId,
    //                                     foodid: orderObj[food3][id],
    //                                     food_quantity: orderObj[food3][f3q]});
    //     })

    //     res.send("confirmation complete - to redirect to final page");
    // } catch (err) {
    //   console.log("Error @POST /order/confirm:", err);
    // }

  });


  router.post("/send", (req, res) => {

    var phoneVar = "Dude"

    // client.messages.create(
    // {
    //   body: `${phoneVar}`,
    //   from: '+16475594746',
    //   to: '+14168763021'
    // }).then(message => console.log(message.sid)).done();


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



    // knex('movies').insert({title: 'Shawshank Redemption', year: '2014'}).returning('*')
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

    // knex('clients').insert({name: finalCart.name, phone_number: finalCart.phone}).returning(clientid)

    // console.log
    // .insert(arrayForDB, {orderid: response[0]}

// knex.insert([{title: 'Great Gatsby'}, {title: 'Fahrenheit 451'}], ['id']).into('books')
// Outputs:
// insert into `books` (`title`) values ('Great Gatsby'), ('Fahrenheit 451')
// knex('movies').insert({title: 'Shawshank Redemption', year: '2014'}).returning('*')

  // res.send("finished placing order")

  // });


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


    // client.messages.create(
    //   {
    //     body: `\n\n Customer Name: ${req.cookies.cart.name} \n\nFood Order: \n${foodExtractor(req.cookies)} \nPhone: ${req.cookies.cart.phone} \n\nTotal Price: $${req.cookies.cart.totalPrice}`,
    //     from: '+16475594746',
    //     to: '+14167958562'
    //   }).then(message => console.log(message.sid)).done();

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
        console.log("grabbing cookie data");
        let cart = getCart(req);

        if(!cart){
          res.redirect("/")
        }
        else {
          console.log("Final Cart: ", cart);
          res.clearCookie('cart');
          res.render("order_final", cart);
        }
      } catch (err) {
        console.log("Error @Get final:", err);
      }




  });



  return router;
}


