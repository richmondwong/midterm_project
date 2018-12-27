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

let basket = {}

$(document).ready(function(){
// jquery to send to cart if add to car button

//checkType converts value to string - double check to make sure this doesnt interfere with the db
function checkType(price){

  // function roundN(num,n){
  // return parseFloat(Math.round(price * Math.pow(10, n)) /Math.pow(10,n)).toFixed(n);
  // }

  var numberPrice = Number(price).toFixed(2);

  // Number(Math.round(price +'e'+ 2) +'e-'+ 2).toFixed(2)

  // parseFloat(Math.round(price * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2)


  // parseFloat(price).toFixed(2);
  //parseFloat(Math.round(price * 100) / 100).toFixed(2)
  return numberPrice;
}


;


// $(".edit").click(function(event){
//   event.preventDefault();

//   // $.get( '/', function (data){
//   //         console.log("this is the data from ajax: ", data)
//   //     })


// })






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

 let id = `<div class="id">${basket[foodId].id}</div>`;
 let name = `<div class="name">${basket[foodId].name}</div>`;
 let price = `<div class="price">${basket[foodId].price}</div>`;
 let quantity = `<div class="quantity">${basket[foodId].quantity}</div>`;

 // $food_item.append(id);
 $food_item.append(name);
 $food_item.append(price);
 $food_item.append(quantity);

 return $food_item
}


function renderBasket(basket){
  $("#food_cart").empty();
  $("#client_details").empty();

  for(foodId in basket){
    const newFoodItem = createItem(foodId);
    $("#food_cart").append(newFoodItem);

    let input=document.createElement('input')
    input.type='hidden';
    input.name='food_basket_item[]';
    input.value=JSON.stringify(basket[foodId]);

    $("#client_details").append(input)

  }

  let total= calculateTotalPrice(basket);
  $("#food_cart").append(total)
  console.log("This is thte total being calculated")
  $("#client_details").append(`<input type="hidden" name="food_basket_total" value="${total}">`)

  // const newHiddenObject = addObject(basket);
  // $("#client_details").append(newHiddenObject)

}

// function deleteFromBasket(id){

// }

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

    // var element = document.getElementById(food_cart);
    console.log("this is the price price: ", foodPrice);
      console.log("this is the price type", typeof foodPrice)
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
    console.log("this is the new basket when minus; ", basket);
    renderBasket(basket)


  });




   $(".page_container").hover(function(event){
     event.preventDefault();
    // const test = "this is a test is it working?"

    $('.item').each(function(){
     let foodName = $(this).data('name');
     let foodPrice = checkType($(this).data('price'));
     let foodId = $(this).data('id');
     let foodQuantity = $(this).data('quantity');

     console.log("this is the food price ", foodPrice)
     console.log("this is the price type", typeof foodPrice)

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

   //  const JSONbasket = JSON.stringify(basket)

   //     $(() => {
   //        $.ajax({
   //          method: "POST",
   //          url: "/",
   //          data: JSONbasket,
   //          success: function(data){
   //            console.log("this is the data ", datas);
   //            const newBasket = JSON.parse(response)
   //            renderBasket(newBasket)
   //          },
   //          error: function(error){
   //            console.log("this is not working,", error)
   //          }
   //        })
   //      })




    // $.ajax({
    //   type: 'POST',
    //   url:'/',
    //   data: basket,
    //   contentType: 'application/json',
    //   dataType: 'json',
    //   processdata: true,
    //   success: function(response){
    //     console.log("this is the resonse", response)
    //     renderBasket(response)
    //   },
    //   error: function(error){
    //     console.log("this is not working,", error)
    //   }
    // });

    // console.log("this is the new basket when edit clicked: ", basket )

    // alert("going back")

    // $.ajax({
    //   method: "POST",
    //   url: "http:localhost:8080/",
    //   data: basket,
    //   dataType: 'json',
    // }).done((data) => {
    //   renderBasket(basket)
    // });;

  // var newBasket = renderBasket(basket)

  // $('#food_cart').append(newBasket)




   // console.log("checking to see whats in the basket?", basket)


  $("#order_heading").hide();
  $("#input_info_container").hide();

  $(".order_button").on("click", function () {
    $("#order_heading").show();
    $("#input_info_container").show();
  })




});

