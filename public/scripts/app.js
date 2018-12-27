let basket = {}

$(document).ready(function(){

//checkType converts value to string -  converts numbers to a string with 2 decimal places
function checkType(price){
  var numberPrice = Number(price).toFixed(2);
  return numberPrice;
};

//function to calculate the total price of items in the basket
function calculateTotalPrice(basket){
 let total = 0;
 for (foodId in basket){
   let itemCost = (basket[foodId].quantity * basket[foodId].price);
   total += itemCost ;
 }
 return total.toFixed(2);
}

//function to create div container with the details of food items (called whenever basket is rendered)
function createItem(foodId){
 let $food_item = $("<div class='food_item'></div>");

 let id = `<div class="id">${basket[foodId].id}</div>`;
 let name = `<div class="name">${basket[foodId].name}</div>`;
 let price = `<div class="price">${basket[foodId].price}</div>`;
 let quantity = `<div class="quantity">${basket[foodId].quantity}</div>`;

 $food_item.append(id);
 $food_item.append(name);
 $food_item.append(price);
 $food_item.append(quantity);

 return $food_item;
}

// function to make a new basket appear everytime a change occurs by emptying div and then appending appropritate data.
function renderBasket(basket){
  $("#food_cart").empty();
  $("#client_details").empty();

  for(foodId in basket){
    const newFoodItem = createItem(foodId);
    $("#food_cart").append(newFoodItem);
    let input=document.createElement('input');
      input.type='hidden';
      input.name='food_basket_item[]';
      input.value=JSON.stringify(basket[foodId]);
    $("#client_details").append(input)
  }

  let total= calculateTotalPrice(basket);
  $("#food_cart").append(total)
  // console.log("This is thte total being calculated")
  $("#client_details").append(`<input type="hidden" name="food_basket_total" value="${total}">`)
}


//JQuery that initializes basket object when 'add' button is clicked
$(".add_to_cart").on("click", function(){

  let foodName = $(this).data('food-name');
  let foodPrice = checkType($(this).data('food-price'));
  let foodId = $(this).data('food-id')

  if (foodId in basket){
    basket[foodId].quantity += 1;
  } else {
    basket[foodId]= {
      id: foodId,
      name: foodName,
      price: foodPrice,
      quantity: 1
    }
  }

  // console.log("this is the price price: ", foodPrice);
  // console.log("this is the price type", typeof foodPrice)
    renderBasket(basket)
});


//JQuery that reduces quantity from basket object and renders new basket with updated quantity values
$(".minus_from_cart").on("click", function(){
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
  // console.log("this is the new basket when minus; ", basket);
  renderBasket(basket)
});

//JQuery that reintializes the basket object with relevant data when returning from different page to edit
$(".page_container").hover(function(event){
  // event.preventDefault();
  // const test = "this is a test is it working?"
  $('.item').each(function(){
    let foodName = $(this).data('name');
    let foodPrice = checkType($(this).data('price'));
    let foodId = $(this).data('id');
    let foodQuantity = $(this).data('quantity');

     // console.log("this is the food price ", foodPrice)
     // console.log("this is the price type", typeof foodPrice)

      basket[foodId]= {
        id: foodId,
        name: foodName,
        price: foodPrice,
        quantity: foodQuantity
      }

    })

    // console.log("this is the new basket from hover; ", basket)
  renderBasket(basket)
})

  // $("#order_heading").hide();
  // $("#input_info_container").hide();

  // $(".order_button").on("click", function () {
  //   $("#order_heading").show();
  //   $("#input_info_container").show();
  // })




});

