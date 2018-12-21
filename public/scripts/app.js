// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// remember AJAX should be used for single page stuff (think tweeter) and is called in the server.js file
var basket = {}

$(document).ready(function(){
// jquery to send to cart if add to car button clicked

function renderBasket(basket){

}

function deleteFromBasket(id){

}

  $(".add_to_cart").on("click", function(){

     let foodName = $(this).data('food-name');
     let foodPrice = $(this).data('food-price');
     let foodId = $(this).data('food-id')


    if (foodId in basket){
        basket[foodId].quantity += 1;
    } else {
        basket[foodId]= {
          name: foodName,
          price: foodPrice,
          quantity: 1
        }
    }

    console.log(basket);


  });

   $(".minus_from_cart").on("click", function(){

     // let foodName = $(this).data('food-name');
     // let foodPrice = $(this).data('food-price');
     let foodId = $(this).data('food-id');


    if( !basket[foodId]){
      console.log("please add to cart first")
    } else {
      if (basket[foodId].quantity === 1){
       delete basket[foodId];
       console.log("deleting item from basket")
     } else {
       basket[foodId].quantity -= 1;
       console.log("minus 1!")
     }
    }
    console.log(basket);


  });




});
