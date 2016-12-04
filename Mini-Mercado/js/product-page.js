
document.addEventListener('DOMContentLoaded', function(){

    var productPage = document.getElementById('item-info');

    if(productPage){
        //Fetch items from api
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    console.log(JSON.parse(xmlhttp.responseText));
                    try{
                        var api =JSON.parse(xmlhttp.responseText);

                        //Render the item
                        render(api);

                    }catch(e){
                        console.log('Formato incorrecto de API')
                    }

                }
                else if (xmlhttp.status == 400) {
                    alert('Error en Api');
                }
                else {
                    alert('Error, status :'+xmlhttp.status);
                }
            }
        };

        xmlhttp.open("GET", "/api/api.json", true);
        xmlhttp.send();

    }

}, false);

function render(api){
    //alert("HERE WE RENDER MINI MERCADO LIBRE");

    //Get the parameters
    var queryParam = getQueryParameters();

    //Get the item id from url
    var itemId = queryParam.id;

    if(itemId){

        var found = false;
        var i =0;

        while(!found && i< api.items.length){
            if(api.items[i].id == itemId){
                found=true
            }else{
                i++
            }
        }

        if(found){
            var item = api.items[i],
                displayname = item.displayname,
                description = item.description,
                questions = item.questions,
                price = item.price,
                listprice= item.listprice,
                quantity = item.quantityavailable,
                image = item.image,
                relatedItems = item.relateditems,
                id = item.id;

            //set elements on DOM
            try{

                //Image
                document.getElementById('main-image').src = "../images/"+image;
                document.getElementById('zoom-default').href = "../images/"+image;

                //Set displayname
                document.getElementById('item-name').innerHTML = displayname;
                //Set price
                document.getElementById('item-price').innerHTML = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                document.getElementById('item-price').setAttribute("itemprop", "price");
                document.getElementById('item-price').setAttribute("content", price);

                //Set list price
                document.getElementById("price-content").getElementsByClassName("before-price")[0].innerHTML = '$'+listprice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                //quantity available
                if(quantity>0){
                    document.getElementsByClassName("disp-available")[0].style.display = "inline";
                    document.getElementsByClassName("available")[0].style.display = "inline";

                    document.getElementsByClassName('available')[0].setAttribute("itemprop", "availability");
                    document.getElementsByClassName('available')[0].setAttribute("href", "http://schema.org/InStock");

                    document.getElementById("add-cart").style.display = "block";
                }else{
                    document.getElementsByClassName("disp-not-available")[0].style.display = "inline";
                    document.getElementsByClassName("not-available")[0].style.display = "inline";
                    //micro data -> we need a seo engine
                    document.getElementsByClassName('not-available')[0].setAttribute("itemprop", "availability");
                    document.getElementsByClassName('not-available')[0].setAttribute("href", "http://schema.org/OutOfStock");

                    document.getElementById("not-add-cart").style.display = "block";



                }

                //Description
                var descriptionContent = '';
                for(var i =0;i <description.length;i++){
                    descriptionContent+= '<h4 class="demo_expandable'+i+' ch-expandable-trigger">'+description[i].title+'</h4><div class="ch-hide"><div>'+description[i].text+'</div></div>';
                }

                var descriptionPoints = description.length;

                descriptionContent = descriptionContent ? descriptionContent : '<p>There is not avaialbe description.</p>' ;
                document.getElementById('description').innerHTML = descriptionContent;

                //Questions
                var questionsContent = '';
                var user;

                for(var i =0;i <questions.length;i++){
                    user = questions[i].user ? '<span class="bold"> - by '+questions[i].user+'</span>' : ''
                    questionsContent+= '<div class="ch-box-icon ch-box-help"><i class="ch-icon-help-sign"></i><span>'+questions[i].question+'</span>'+user+'</div>';
                    if(questions[i].reply){
                        questionsContent += '<div class="ch-box-icon ch-box-info"><i class="ch-icon-info-sign"></i><span>'+questions[i].reply+'</span></div>';
                    }
                }

                questionsContent = questionsContent ? questionsContent : '<p>There are not questions right now.</p>' ;
                document.getElementById('questions').innerHTML = questionsContent;

                //Carousel
                var relatedContent ='<ul>';

                for(var i =0;i <relatedItems.length;i++){
                    //itemprop="isRelatedTo" itemscope itemtype="http://schema.org/Product"

                    //If the name is too large, the we cut it
                    var dispName = relatedItems[i].displayname.length > 16 ? relatedItems[i].displayname.substr(0,16)+'...' : relatedItems[i].displayname;

                    relatedContent += '<li><a href="/product-page.html?id='+relatedItems[i].id+'"><img class="related-item"  src="images/'+relatedItems[i].image+'"></img><p class="name-related">'+dispName+'</p><p class="price-related">$'+relatedItems[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</p></a></li>';
                }

                //{"id":1,"displayname":"Kia Picanto FULL MANUAL","price" : 12490, "image":"kia-picanto.jpg"}
                document.getElementById('related-items').getElementsByClassName('ch-carousel')[0].innerHTML = relatedContent+'</ul>';


                events(api,item,descriptionPoints);

            }catch(e){
                console.log(e)
            }
        }else{
            alert('This item is not longer available');
        }

    }else{

        alert('Select an item');
    }





}

function events(api,item,descriptionPoints){

    //Tabs
    var demoTabs = document.getElementsByClassName("demo-tabs");
    if(demoTabs.length){
        var tabs = new ch.Tabs(ch(".demo-tabs")[0]);
    }

    //Zomm images
    var zoomDefault = document.getElementById("zoom-default");
    if(zoomDefault){
        var zoom1 = new ch.Zoom(ch('#zoom-default')[0]);
    }

    //Bubble
    var bubble = new ch.Bubble(ch('#more-button')[0], {
        content: 'Quantity avaiable exceeded.'
    });

    //Modal
    var modalX = new ch.Modal({
        'hiddenby': 'button'
    });

    //Carousel
    var demoTabs = document.getElementsByClassName("demo-carousel");

    if(demoTabs){
        var carousel = new ch.Carousel(ch('.demo-carousel')[0], {
            pagination: true
        });
    }

    //Expandible description menu

    var expandables = [];
    for(var j=0; j< descriptionPoints; j++){
        expandables.push( new ch.Expandable(document.querySelector('.demo_expandable'+j)));
    }



    //Listeners
    var moreButton = document.getElementById("more-button");
    var lessButton = document.getElementById("less-button");
    var inputQuantity = document.getElementById("item-quantity");
    var addToCartButton = document.getElementById("add-to-cart");

    if(moreButton && inputQuantity){
        moreButton.addEventListener("click", function(){
            //Add quantity to the input
            var actualVal = parseInt(inputQuantity.value);
            if(actualVal){
                if(actualVal < parseInt(item.quantityavailable)){
                    inputQuantity.value = actualVal +1;
                }else{
                    bubble.show();
                    bubble._options._hideDelay = 2000;
                    bubble._hideTimer();
                }

            }else{
                inputQuantity.value = 1;
            }
        });
    }

    if(lessButton && inputQuantity){
        lessButton.addEventListener("click", function(){
            //Add quantity to the input
            var actualVal = parseInt(inputQuantity.value);
            if(actualVal){
                inputQuantity.value = (actualVal -1 <=0) ? 1 : actualVal -1;
            }else{
                inputQuantity.value = 1;
            }
        });
    }

    if(inputQuantity){
        inputQuantity.addEventListener("change", function(){
            if(!isInt(inputQuantity.value)){
                inputQuantity.value = 1;

            }

        });
    }

    if(addToCartButton && inputQuantity){
        addToCartButton.addEventListener("click", function(){

            //Get value of the input
            var actualVal = parseInt(inputQuantity.value);
            if(actualVal){
                //read cart cookie
                var cart = readCookie('cart');
                if(!cart){
                    cartInstance=[];
                }else{
                    cartInstance = JSON.parse(cart);

                }

                var i=0;
                var found=false;

                //Search if the item is already on the cart
                while(!found && i<cartInstance.length){
                    if(cartInstance[i].id == item.id){
                        found=true;
                    }else{
                        i++;
                    }
                }

                if(found){
                    //Check if there is quantity available
                    if( parseInt(cartInstance[i].quantity)+ actualVal < parseInt(item.quantityavailable)){
                        cartInstance[i].quantity = parseInt(cartInstance[i].quantity)+ actualVal;
                        //Save the Cart
                        document.cookie = "cart="+JSON.stringify(cartInstance);
                        modalX.show('<i class="ch-icon-ok-sign left"></i><h2 class="left">Item added succesfully</h2>');


                    }else{
                        modalX.show('<i class="ch-icon-warning-sign left"></i><h2 class="left">Quantity exceeded</h2><p class="inblock">The quantity of this item that you have on your Cart plus this quantity exceed the quantity avaiable.</p>');
                    }
                }else if( actualVal <= parseInt(item.quantityavailable)) {
                    //If the quantity is less than the avaiable then we add it to the cart
                    var itemSend = {displayname : item.displayname, image : item.image, price : item.price};

                    cartInstance.push({id: item.id,quantity: actualVal,item : itemSend});
                    //Save the Cart
                    document.cookie = "cart="+JSON.stringify(cartInstance);

                    if(document.getElementById('quantity-cart') ){
                        document.getElementById('quantity-cart').innerHTML = cartInstance.length;
                    }


                    modalX.show('<i class="ch-icon-ok-sign left"></i><h2 class="left">Item added succesfully</h2>');

                }else{
                    modalX.show('<i class="ch-icon-warning-sign left"></i><h2 class="left" >Quantity exceeded</h2><p class="inblock">The quantity that you selected exceed the quantity available.</p>');
                }



            }else{
                alert('Error, Quantity: '+actualVal);
            }
        });
    }



    document.getElementById('loader').style.display = "none";



}

//Utils
function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

function getQueryParameters() {

    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");

        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);

        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;

        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


