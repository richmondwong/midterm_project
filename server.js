"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
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
      console.log("we have an error: ", err)
    })

});

//route to get to order confirm page where order id displayed as id in url
app.get("/order/:id", (req,res) =>{

  const NewOrderId = req.params.id;

  knex // write query that gets the join table TODO !!!
    .select("*")
    .from("orders")
    .where(orderid = NewOrderId)
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
      console.log("we have an error: ",err);
    })

})

//route to get the confirmation page where message saying order has been placed will appear
app.get("/order/:id/confirm", (req,res)=>{
  res.render("order_confirm");
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



















































































































































































































































































































app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// stanleys stuff from here on out
