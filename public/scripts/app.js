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

function deleteFromBasket(id)
  $(".add_to_cart").on("click", function(){

     let foodName = $(this).data('food-name');
     let foodPrice = $(this).data('food-price');
     let foodId = $(this).data('food-id')
    // console.log(yop);

    if (foodId in basket){
        basket[foodId].quantity += 1;
    } else {
        basket[foodId]= {
          name: foodName,
          price: foodPrice,
          quantity: 1
        }
    }

    renderBasket(basket);


  });




});
