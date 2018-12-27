# Midterm Project - Heart Attack Grill

## Description

Heart Attack Grill is a food ordering app that uses Express, JQuery, Bootstrap, CSS, Sass, Knex and PostgreSQL. 

In a nutshell, hungry customers of this app can add different food items to their shopping cart, and upon purchase confirmation, the app will send a SMS to the restaurant with relevant information about the order (customer name, phone number, items bought, quantity and total price). Simultaneously, the restaurant can also view a list of pending orders within the app, from where they can input an estimated time for order pickup. When this is done, a second SMS is sent to the customer with information about the restaurant's estimated time for pick up. 

## Screenshots

A full list of URLs for a logged in user. Includes shortURL and longURL as well as functionality to edit and delete the URLs.
!["Screenshot of urls page"](https://github.com/richmondwong/tinyapp/blob/master/docs/urls.png)


## Getting Started

- Install all dependencies (using 'npm install')
- Run "knex migate:latest"
- Run the development web server using the 'npm run local' command

## Dependencies

- body-parser
- cookie-parser
- dotenv
- ejs
- express
- knex
- knex-logger
- moment
- moment-timezone
- morgan
- node-sass-middleware
- pg
- twilio
