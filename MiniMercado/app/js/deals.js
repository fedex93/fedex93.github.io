
document.addEventListener('DOMContentLoaded', function(){

    var dealsPage = document.getElementById('deals-items');

    if(dealsPage){
        //Fetch items from api
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    console.log(JSON.parse(xmlhttp.responseText));
                    try{
                        var api =JSON.parse(xmlhttp.responseText);

                        //Render the item
                        renderDeals(api);

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

function renderDeals(api){

    try{

        //Carousel
        var relatedContent ='<ul>';

        for(var i =0;i <api.items.length;i++){

            var dispName = api.items[i].displayname.length > 16 ? api.items[i].displayname.substr(0,16)+'...' : api.items[i].displayname;
            relatedContent += '<li><a href="/product-page.html?id='+api.items[i].id+'"><img class="related-item"  src="images/'+api.items[i].image+'"></img><h3 class="name-related">'+dispName+'</h3><h3 class="price-related">$'+api.items[i].price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</h3></a></li>';

        }

        document.getElementById('deals-items').getElementsByClassName('ch-carousel')[0].innerHTML = relatedContent+'</ul>';


        eventsDeals(api);

    }catch(e){
        console.log(e)
    }

}

function eventsDeals(api){

    //Carousel
    var demoTabs = document.getElementsByClassName("demo-carousel");

    if(demoTabs){
        var carousel = new ch.Carousel(ch('.demo-carousel')[0], {
            pagination: true
        });
    }

}



