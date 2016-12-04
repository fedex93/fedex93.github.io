document.addEventListener('DOMContentLoaded', function(){

    //Cart quantity
    drawCart();


    if(document.getElementById('quantity-cart') ){


        //Clear cart button, clean the cookie
        if(document.getElementById('clean-cart')){
            document.getElementById('clean-cart').addEventListener('click',function(){
                document.cookie = "cart=";
                if(document.getElementById('quantity-cart') ){
                    document.getElementById('quantity-cart').innerHTML = 0;
                }
                drawCart();
            })
        }



        //Content of the Cart
        var cart = new ch.Modal(ch('#quantity-cart')[0], {'content': document.querySelector('#cart-content')});

        if(document.getElementById('quantity-cart')){
            document.getElementById('quantity-cart').addEventListener('click',function(){
                drawCart();
            })
        }
        drawCart();
    }

    //AutoComplete
    /*var auto = document.getElementsByClassName("autocomplete");
    if(auto.length){
        var autocomplete = new ch.Autocomplete(document.querySelector('.autocomplete'))
            .on('type', function (userInput) {
                tiny.jsonp('http://suggestgz.mlapps.com/sites/MLA/autosuggest?q=' + userInput + '&v=1', {
                    name: 'autocompleteSuggestion',
                    success: function(data){
                        console.log(data)
                    },
                    error: function(err) {
                        autocomplete.suggest([]);
                    }
                });
            });
    }*/

    document.getElementById('loader').style.display = "none";
}, false);

function readCookieHeader(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function drawCart(){
    var cart = readCookieHeader('cart');
    var cartQuantity =0;
    if(cart){
        var cartInstance = JSON.parse(cart);
        cartQuantity = cartInstance.length;
        document.getElementById('quantity-cart').innerHTML = cartQuantity;

        var divContent="";
        var total=0;
        for(var i=0;i<cartInstance.length;i++){
            //body-cart
            divContent += '<tr><td><img class="cart-item" src="images/'+cartInstance[i].item.image+'"></td><td>'
                +cartInstance[i].item.displayname+'</td><td>'+cartInstance[i].quantity+
                '</td><td>$'+cartInstance[i].item.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</td><td></td></tr>';

            total += parseInt(cartInstance[i].quantity) * parseFloat(cartInstance[i].item.price);
        }


        divContent+= '<td>TOTAL:</td><td></td><td></td><td>$'+total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
            +'</td><td><input type="button" id="buy-now" class="ch-btn" value="Buy Now!"></td>'


        if(document.getElementById("body-cart")){
            document.getElementById("body-cart").innerHTML = divContent;


            //Buy now button, error with server
            debugger;
            if(document.getElementById('buy-now')){
                document.getElementById('buy-now').addEventListener('click',function(){
                    debugger;
                    document.getElementById('loader').style.display = 'block';
                    setTimeout(function(){
                        document.getElementById('loader').style.display = 'none';
                        document.getElementById('connection-error').style.display = 'block';
                        setTimeout(function(){
                            document.getElementById('connection-error').style.display = 'none';
                        }, 3000);
                    }, 3000);
                })
            }
        }
    }else{
        //Set cart empty message
        var divContent = '<td></td><td></td><td>Your Cart is empty.</td><td></td><td></td>';
        if(document.getElementById("body-cart")){
            document.getElementById("body-cart").innerHTML = divContent;

        }
    }
}

function searchMeli(e){

    if(document.getElementById('search')){
        var searchContent = document.getElementById('search').value;
        if(searchContent){
            //redirect to MELI
            window.location = "http://listado.mercadolibre.com.uy/"+searchContent;
        }

    }

}