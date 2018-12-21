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
// jquery to send to cart if add to car button
function checkType(price){
  if (typeof price === 'string'){
    var numberPrice = parseFloat(price).toFixed(2);
  } else {
    var numberPrice = price;
  }
  return numberPrice
}

function calculateTotalPrice(basket){

 let total = 0;

  for (foodId in basket){
    var itemCost = (basket[foodId].quantity * basket[foodId].price)

    total += itemCost
  }

 return total.toFixed(2);
}

function createItem(foodId){
 let $food_item = $("<div class='food_item'></div>");

 let name = `<div class="name">${basket[foodId].name}</div>`;
 let price = `<div class="price">${basket[foodId].price}</div>`;
 let quantity = `<div class="quantity">${basket[foodId].quantity}</div>`;


 $food_item.append(name);
 $food_item.append(price);
 $food_item.append(quantity);

 return $food_item
}

function renderBasket(basket){
  $("#food_cart").empty();

  for(foodId in basket){
    const newFoodItem = createItem(foodId);
    $("#food_cart").prepend(newFoodItem);
  }

  let total= calculateTotalPrice(basket);
  $("#food_cart").append(total)
}

// function deleteFromBasket(id){

// }

  $(".add_to_cart").on("click", function(){

     let foodName = $(this).data('food-name');
     let foodPrice = checkType($(this).data('food-price'));
     let foodId = $(this).data('food-id')

console.log(foodPrice)

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
    renderBasket(basket)



  });

   $(".minus_from_cart").on("click", function(){

     // let foodName = $(this).data('food-name');
     // let foodPrice = $(this).data('food-price');
     let foodId = $(this).data('food-id');


    if( !basket[foodId]){
      alert("please add to cart first")
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
    renderBasket(basket)


  });




});

