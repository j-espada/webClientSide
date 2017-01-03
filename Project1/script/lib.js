/**
* Created by J.Espada on 15/05/2016.
*/
http_request = false;
xmlhttp = new XMLHttpRequest();

var xml_tree;
var shopping_cart = [];
var products = [];
var expenses = 0;

function createProduct(type, price, available, name) {
  this.type_prod = type;
  this.price_prod = price;
  this.available_prod = available;
  this.id_prod = name;
  this.quantity_in_basket = 0 ;
}


function loadXML(xmlFile) {

  http_request = false;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
    http_request = new window.XMLHttpRequest();

  } else if (window.ActiveXObject) { // IE
    try {
      http_request = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
      try {
        http_request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
  }

  if (!http_request) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }

  http_request.open("GET", xmlFile, false);

  http_request.send(null);
  xml_tree = http_request.responseXML;
}

function scrollUp() {

    window.scrollTo(0, 0);
}

function showHide(show, hide) {
  $(hide).hide();
  $(show).show();
}


function addToShoppingCart(str) {
  var x = str;
  console.log(str);
  var buyedProduct;
  //$("#added-alert").hide();
  for (i = 0; i < products.length; i++) {

    if (products[i].id_prod == x) {
      buyedProduct = products[i];
      buyedProduct.quantity_in_basket++;
      $("#added-alert").html('<div class="alert alert-success fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> <strong>Sucess!</strong>The product was added to your Shopping Cart</div>');
      $("#added-alert").show();
      break;
    }

  }
  if (buyedProduct.quantity_in_basket < 2) {
    shopping_cart.push(buyedProduct);
  }

}

function showShoppingCart() {
  $("#productsDiv").hide();
    $("#h2").hide();
    $("#myCarousel").hide();
    $("#shopping-cart").show();
  calculateBill();
}

function check() {
  var mul = document.getElementById("mb").checked;
  var transf = document.getElementById("transfer").checked;
  var levantarLoja = document.getElementById("pickup-store").checked;
  var info = document.getElementById("payment-info");
  var quantia = "Value to pay";
  var euros = "&euro;";

  if (mul == true && expenses > 0) {

    info.innerHTML+= '<div class="alert alert-info"><strong>Payment Data</strong> <p>Ref YYYYY</p> <p>Entity XXX </p> <p>' + quantia + expenses + euros + '</p> </div>';

    document.getElementById("input-confirm").disabled = true;
    $("#payment-info").show();
  }
  else if (transf == true && expenses > 0) {
    info.innerHTML = '<div class="alert alert-info"><strong>Payment Data</strong> <p>NIB: YYYYY</p> <p>' + quantia + expenses + euros + '</p> </div>';
    document.getElementById("input-confirm").disabled = true;
    $("#payment-info").show();
  }
  else if (levantarLoja == true && expenses > 0) {
    info.innerHTML = '<div class="alert alert-info"><strong>Payment Data</strong>You can pick up the package at the store</div>';
    document.getElementById("input-confirm").disabled = true;
    $("#payment-info").show();
  }
  else
  {
    document.getElementById("no-itens-cart").innerHTML= '<div class="alert alert-danger"> <strong>Error!</strong>No Products in Shopping Cart</div>';
  }


}

function calculateBill() {
  expenses = 0 ;
  document.getElementById("cart-list").innerHTML = "";

  var x = '<table class="table"> <thead> <tr> <th>Product Name</th> <th>Price for unit</th> <th>Quantity</th> <th>Price</th></tr> </thead> <tbody> ';

  for (var i = 0; i < shopping_cart.length; i++)
  {

    var n = obtainQuantity(shopping_cart[i].id_prod);
    var prod = shopping_cart[i];
    var quantity = '<span><input type="text" ' + ' value="'+ n +'" ' +' size="4" > <button type="button" class="btn btn-default" onclick="incrementProd('+i+')" > + </button> <button type="button" class="btn btn-default" onclick="decrementProd('+i+')">-</button></span>';

     x = x + '<tr> <td>' + prod.id_prod + '</td> <td>' + prod.price_prod + '</td> <td> ' + quantity + '</td> <td> ' + n*prod.price_prod + "&euro;" + '</td>  <td> <button class="btn btn-danger" onclick="removeItem('+i+')">x</button> </td>  </tr>';

    expenses = expenses + parseInt(n*prod.price_prod);
  }

  x = x + '<tr> <td>' + expenses + "&euro;"+ '</td> </tr> </tbody> </table>' ;
  document.getElementById("cart-list").innerHTML = x;

}

function incrementProd(prodIndex){
  shopping_cart[prodIndex].quantity_in_basket ++ ;
  calculateBill();
}

function decrementProd(prodIndex){
  if(shopping_cart[prodIndex].quantity_in_basket > 0) {

    shopping_cart[prodIndex].quantity_in_basket -- ;
    calculateBill();
  }


}

function obtainQuantity(id) {
  var counter = 0;

  for (var j = 0; j < shopping_cart.length; j++)
  {
    if(shopping_cart[j].id_prod == id){
      counter = shopping_cart[j].quantity_in_basket;
      break;
    }
  }

  return counter;
}


function removeItem(x) {
  expenses = 0 ;
  var newBasket = [];
  for (i = 0; i < shopping_cart.length; i++)
  {
    if(x != i ){

        newBasket.push(shopping_cart[i]);
    }

  }

  shopping_cart = newBasket;
  calculateBill();
}

function submitLoginForm() {

  loadXML("users.xml");
  var x = xml_tree.getElementsByTagName("user");
    var sensor = 0;
  var username = document.getElementById("username").value;
  console.log(username);
  var password =  document.getElementById("password").value;
  console.log(password);

  for (i = 0; i < x.length; i++)
  {
      var temp_username = x[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
      console.log(temp_username);
      var temp_password = x[i].getElementsByTagName("password")[0].childNodes[0].nodeValue;
      console.log(temp_password);

      if( (username == temp_username) && (password == temp_password)) {
          $('#myModal').modal('hide');
          $('#status').html('<a href="#" id="status" data-toggle="modal" data-target="#myModal"> <span  class="glyphicon glyphicon-log-out"></span>'+" "+username+'</a>');
          sensor = 1;

      }

  }

  if(sensor == 0)
      $("#alert-bad-login").show();

}

function loadProducts(prodType) {
    $("#myCarousel").show();
    $("#productsDiv").show();
    $("#h2").show();
    $("#shopping-cart").hide();
    $("#products-news").hide();
    loadXML("products.xml");

    var x = xml_tree.getElementsByTagName("product");
    var div = document.getElementById("productsDiv");
    var h2 = document.getElementById("h2");
    h2.innerHTML = "<h2 id='h2' class='display-1'> " + prodType.toUpperCase() + " </h2>";
    div.innerHTML = "";

    for (i = 0; i < x.length; i++) {
       aux(i,x,div,prodType);
    }
}
    function contactValidation() {

        var result = false;
        var phone = $("#phoneContact").val();
        $("#alert-contact-form").empty();
        var name = $("#nameContact").val();
        console.log(Number(phone));
        if (name.length > 3 && phone.length == 9 && isNaN(Number(phone)) == false) {

            result = true;
            $("#alert-contact-form").addClass("alert-success");
            $("#alert-contact-form").append(document.createTextNode("Sucess!"));
        }
        else {
            $("#alert-contact-form").addClass("alert-warning");
            $("#alert-contact-form").append(document.createTextNode("The name field must have at more than 3 letters and" +
                " the phone field must have 9 digits"));

        }
        console.log(result);
        return result;
    }

function aux(i,x,div,prodType) {

    var prod_name = x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var prod_type = x[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
    var prod_available = x[i].getElementsByTagName("available")[0].childNodes[0].nodeValue;
    var imgScr = x[i].getElementsByTagName("img")[0].childNodes[0].nodeValue;
    var prod_price = x[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;

    var temp_prod = new createProduct(prod_type, prod_price, prod_available, prod_name);
    // console.log(temp_prod);
    products[i] = temp_prod;

    if (prod_available == "true" && prodType == prod_type) {

        var $div = $("<div>");
        $div.addClass("col-md-3");

        var $img_prod = $("<img>");
        $img_prod.addClass("img-responsive");
        $img_prod.attr("src", imgScr);
        $img_prod.attr("alt", prod_name);
        $img_prod.appendTo($div);


        var $info = $("<div>");
        $info.addClass("info-prod");
        $info.append($("<p>").append(document.createTextNode(prod_name), $("<p>").append(document.createTextNode(prod_price + " euros"))));
        $info.appendTo($div);

        var $available = $("<span>");
        $available.addClass("span-info");
        var $available_img = $("<img>");
        $available_img.attr("src", "img/available.png");
        $available_img.attr("alt", "available product");
        $available_img.addClass("avaibility");
        $available.append(document.createTextNode("Available :"));
        $available_img.appendTo($available);
        var $br = $("<br>");
        $br.appendTo($available);

        $available.appendTo($div);


        var onClickProd = x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        console.log(onClickProd);

        var $button = $("<button>");
        $button.addClass("btn btn-success active");
        $button.click(function (event) {

            addToShoppingCart(onClickProd);
        });

        $button.append(document.createTextNode("Add to Cart"));


        $button.appendTo($div);
        $div.appendTo(div);

        //div.innerHTML += '<div class="col-md-3"> <img src="'+imgScr+'" class="img-responsive" alt="'+prod_name+'" > <p>'+prod_name+'</p> <p>'+prod_price+'&euro;</p> <span>Available <img src="http://www.bikefernie.ca/sites/default/files/images/difficulty-green-circle-40.png" class="disponibilidade" alt="disponivel"> </span> <br> <button type="button" class="btn btn-success active" onclick=addToShoppingCart('+prod_name+')>Add to Basket</button> </div>';
    }

    else if (prod_available == "false" && prodType == prod_type) {
        var $div = $("<div>");
        $div.addClass("col-md-3");

        var $img_prod = $("<img>");
        $img_prod.addClass("img-responsive");
        $img_prod.attr("src", imgScr);
        $img_prod.attr("alt", prod_name);
        $img_prod.appendTo($div);


        var $info = $("<div>");
        $info.addClass("info-prod");
        $info.append($("<p>").append(document.createTextNode(prod_name), $("<p>").append(document.createTextNode(prod_price + " euros"))));
        $info.appendTo($div);

        var $available = $("<span>");
        $available.addClass("span-info");
        var $available_img = $("<img>");
        $available_img.attr("src", "img/unavailable.png");
        $available_img.addClass("avaibility");
        $available_img.attr("alt", "available product");
        $available.append(document.createTextNode("Available :"));
        $available_img.appendTo($available);
        var $br = $("<br>");
        $br.appendTo($available);

        $available.appendTo($div);

        var $button = $("<button>");
        $button.addClass("btn btn-danger disabled");
        $button.append(document.createTextNode("Add to Cart"));
        $button.appendTo($div);
        $div.appendTo(div);

    }

    console.log(products[i]);

}



