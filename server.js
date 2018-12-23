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
const orderRoutes       = require("./routes/order");
const restaurantRoutes  = require("./routes/restaurant");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/styles"));

// Mount all resource routes
app.use("/order", orderRoutes(knex));
app.use("/restaurant", restaurantRoutes(knex));


// Home page
app.get("/", (req, res) => {
// knex querie3 to db to return menu items and render them on homepage
  var cart = req.cookies.cart;

  if(!cart){
    knex
    .select("*")
    .from("foods")
    .then((results) => {
      const menu = results;

      // console.log("this is the menu from knex query: ", menu);

      const templateVars = {
        menu: menu,
        cookie: false
      };

      return templateVars;

    })
    .then((template) =>{
      res.render("index", template);
    })
    .catch((err)=>{
      console.log("Error @GET / : ", err)
    })
  } else {
    knex
    .select("*")
    .from("foods")
    .then((results) => {
      const menu = results;

      // console.log("this is the menu from knex query: ", menu);

      const templateVars = {
        menu: menu,
        cookie: true,
        cartCookie: {
           name : cart.name,
           phone: cart.phone,
           foodOrder : cart.foodOrder,
           totalPrice : cart.totalPrice
        }
      };

      return templateVars;

    })
    .then((template) =>{
      res.render("index", template);
    })
    .catch((err)=>{
      console.log("Error @GET / : ", err)
    })
  }

});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});



