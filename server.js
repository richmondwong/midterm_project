"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const cookieParser = require('cookie-parser')
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
// const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static(__dirname + "/public"));

// Mount all resource routes
// app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
// knex querie3 to db to return menu items and render them on homepage
  knex
    .select("*")
    .from("foods")
    .then((results) => {
      const menu = results;

      console.log("this is the menu from knex query: ", menu);

      const templateVars = {
        menu: menu
      };

      return templateVars;

    })
    .then((template) =>{
      res.render("index", template);
    })
    .catch((err)=>{
      console.log("Error @GET / : ", err)
    })

});

//route to get the confirmation page where message saying order has been placed will appear
app.get("/order/confirm", (req,res)=>{
  try {
    res.render("order_confirm");
  } catch (err){
    console.log("Error @GET order/final:", err);
  }

})

//route to get to order confirm page where order id displayed as id in url
app.get("/order/:id", (req,res) =>{

  const NewOrderId = req.params.id;

  knex // write query that gets the join table TODO !!!
    .select('*')
    .from('orders')
    .where('orderid', '=', NewOrderId)
    .then((results) => {
        const clientOrder = results;

        console.log("this is the clientOrder from knex query: ", clientOrder); //check to see whats actually being returned by query

        const templateVars = {
          order : clientOrder
        };


        return templateVars;
    })
    .then((template) =>{
      res.render("order_id", template);
    })
    .catch((err)=>{
      console.log("Error @GET order/confirm: ",err);
    })

})


//restaurant-side GETS

//route to get to restaurant login page (where redirected to if trying to access other page without logging in) STRETCH

app.get("/restaurant", (req,res)=>{
  res.render("restaurant");
})

//route to get to page where restaruant will view the orders being palced
app.get("/restaurant/summary", (req,res)=>{

    knex // write query that gets the join table so orders can be seen by restaurant TODO !!!
    .select("*")
    .from("orders")
    .where(orderid = NewOrderId)
    .then((results) => {
        const clientOrder = results;

        console.log("this is the clientOrder from knex query that the restuaruant will see: ", clientOrder); //check to see whats actually being returned by query

        const templateVars = {
          order : clientOrder
        };

        return templateVars;
    })
    .then((template) =>{
      res.render("restaurant_summary", template);
    })
    .catch((err)=>{
      console.log("we have an error: ",err);
    })

})


// stanleys stuff from here on out

//Grab order data and input to DB
app.post("/order", (req, res) => {
  try {
    //get order data.
    //let totalFoods = knex.select().from('foods').length;
    //***implement filter to remove food items with 0 quantity.
    // let cookieObject =  { food1 : req.body.food1,
    //                       food2 : req.body.food2,
    //                       food3 : req.body.food3,
    //                       food4 : req.body.food4,
    //                       food5 : req.body.food5,
    //                       food6 : req.body.food6,
    //                       name : req.body.clientName,
    //                       phone : req.body.phone
    //                     };

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

//Grab data from the cookie, input to db, redirect
app.post("/order/confirm", (req, res) => {
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
  } catch (err) {
    console.log("Error @POST /order/confirm:", err);
  }

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

