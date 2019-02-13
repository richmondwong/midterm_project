
!["Screenshot of demo"](https://github.com/richmondwong/midterm_project/blob/master/docs/heart_attack_480.gif)

# Heart Attack Grill

## Description

Heart Attack Grill is a food ordering app that uses Express, JQuery, Bootstrap, CSS, Sass, Knex and PostgreSQL. 

In a nutshell, hungry customers of this app can add different food items to their shopping cart, and upon purchase confirmation, the app will send a SMS to the restaurant with relevant information about the order (customer name, phone number, items bought, quantity and total price). Simultaneously, the restaurant can also view a list of pending orders within the app, from where they can input an estimated time for meal preparation. When this is done, the estimated time is sent via SMS to the customer. 

This app was created by Stanley Lau, Mariam Majeed and Richmond Wong. 

## Screenshots

Upon loading of Heart Attack Grill - with rotating carousel of images.

!["Screenshot of homepage"](https://github.com/richmondwong/midterm_project/blob/master/docs/homepage.png)

Customers can pick from the menu and see informtion about their selected items and associated prices. They also leave their name and phone number in order to recieve a SMS from the restaurant with an estimated wait time for food pick up.

!["Screenshot of menu page and purchase cart"](https://github.com/richmondwong/midterm_project/blob/master/docs/cart.png)

Customers can go back to edit their shopping cart or confirm their order (upon which a SMS with their purchase is sent as a SMS to the restaurant).

!["Screenshot of showing confirm or edit"](https://github.com/richmondwong/midterm_project/blob/master/docs/confirm_order.png)

The restaurant has access to a running list of orders updated in real-time, and they can input an estimated time for meal preparation. Upon input, a SMS with the time estimate is sent to the customer.

!["Screenshot of orders summary page for the restaurant"](https://github.com/richmondwong/midterm_project/blob/master/docs/restaurant_summary.png)

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
