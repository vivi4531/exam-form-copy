"use strict";

// const { build } = require("vite");

window.addEventListener("DOMContentLoaded", init);

let jsonData; 
let jsonPrices; 
let basket = []; 
let order = [];
let total = 0;

function init() {
  console.log("Der er hul igennem 🥳");
  document.querySelector(".buttontobasket").addEventListener("click", buildBasket);
  document.querySelector(".singleviewtobasket").addEventListener("click", buildBasket);
  document.querySelector(".baskettopayment").addEventListener("click", listenForClickOnSubmit);
  document.querySelector("#buttonbacktobasketoverview").addEventListener("click", () => {document.querySelector("#basket-payment").classList.add("hide"); document.querySelector("#basket-overview").classList.remove("hide");});
  //document.querySelector(".betalordre").addEventListener("click", post);
  document.querySelector(".buttontomenu").addEventListener("click", getData);
  document.querySelector(".buttonbacktomenu").addEventListener("click", backToMenu);
}

async function getData() {
  document.querySelector("#menu").classList.remove("hide"); 
  document.querySelector("#header").classList.remove("hide");
  document.querySelector("#frontpage").classList.add("hide");
  document.querySelector("#emptybasket-overview").classList.add("hide");

  //Pil tilbage til forsiden fra menu
  document.querySelector("#buttontofrontpage").addEventListener("click",() => {document.querySelector("#menu").classList.add("hide"); document.querySelector("#frontpage").classList.remove("hide"); document.querySelector("#header").classList.add("hide");});

  let url = "https://teamellewoods.herokuapp.com/beertypes";
  jsonData = await fetch(url);
  jsonData = await jsonData.json();

  let prices = "./prices.json"; 
  jsonPrices = await fetch(prices);
  jsonPrices = await jsonPrices.json();
  console.log({ jsonData });

  let container = document.querySelector(".menu-container");
  //Tømmer container så listen med øl ikke lægges ind flere gange
  container.innerHTML = "";
  let temp = document.querySelector(".beertemplate");
 
  //i = index 
  jsonData.forEach((beer, i) => {

    //Tilføjer plads i basket array
    basket.push(0); 

    const beertype = [{ name: beer.name, amount: 1 }]; 
    fetchBeerStatus(beertype).then(beerdata => {
    
    //Hvis status er lig 200 (på lager) så klon øllen i menuen
    if(beerdata.status===200){
    const clone = temp.cloneNode(true).content;

    //Input feltet viser id for den valgte øl 
    clone.querySelector("#beer_").id = "beer_" + i;
    clone.querySelector("#beer_" + i).addEventListener("change", updateBasket); 

    clone.querySelector(".beer-image").src = `./img/beer/${beer.label}`;
    clone.querySelector(".beer-image").addEventListener("click", () => showDetails(i));

    clone.querySelector(".beer-name").textContent = beer.name;
    clone.querySelector(".beer-price").textContent = jsonPrices[i].price + " kr.";
    clone.querySelector(".alc").textContent = beer.alc + "% alc.";

    container.appendChild(clone);
    
    }
  });
});

  console.log(basket); 

}

function backToMenu(){
  console.log("Du er på startsiden");

  document.querySelector("#menu").classList.remove("hide");
  document.querySelector("#emptybasket-overview").classList.add("hide");

  //Sæt inputfelter til 0
  document.querySelectorAll(".input-beer").forEach((beer) => {
    beer.value = 0; 
  });
  
  //Sæt kurv til 0
  document.querySelector("#basketamount").innerHTML = 0;  

}

function showDetails(i){
console.log("Vis deltajer om øl"); 

document.querySelector("#beer-single").classList.remove("hide"); 
document.querySelector("#menu").classList.add("hide"); 
document.querySelector("#buttonbacktomenu").addEventListener("click", updateInput); 

document.querySelector(".beersingle-input").id = "beersingle_" + i; 

document.querySelector("#beersingle_" + i ).addEventListener("change", updateBasket); 

//Opdater inputfelt med antal
document.querySelector("#beersingle_" + i).value = basket[i];

document.querySelector("#beer-single .beer-image").src = `img/beer/${jsonData[i].label}`;
document.querySelector("#header h1").textContent = `${jsonData[i].name}`;
document.querySelector("#header h1").style.fontSize = "1.8em"; 

document.querySelector("#beer-single .beer-name").textContent = jsonData[i].name;
document.querySelector("#beer-single .beer-price").textContent = jsonPrices[i].price + " kr.";
document.querySelector("#beer-single .alc").textContent = jsonData[i].alc + "% alc.";
document.querySelector("#beer-single .desc").textContent = jsonData[i].description.aroma;

document.querySelector(".singleviewtobasket")

}

function updateBasket(){
  console.log("Update basket");
  //.split = splitter id_x 
  //.pop = kun den sidste værdi (x) der bliver gemt i arrayet
  let beerid = this.id.split("_").pop();
  let thisname = this.id.split("_").shift();
  console.log(beerid);
  console.log(thisname);

  if(thisname == "removebutton"){
    //Vælger plads i array der stemmer overens med beerid og sætter værdien til 0 (fjerner alle)
    basket[beerid] = 0; 
    buildBasket(); 
  } else {
    //Vælger plads i array der stemmer overens med beerid og gemmer værdi fra inputfeltet som et nummer
    basket[beerid] = Number(this.value); 
  }

  console.log(basket);

  //Opdater antal øl i kurven (vist i menulinje)
  document.querySelector("#basketamount").innerHTML = (basket.reduce((a,b) => a+b)).toString();
  
  total = 0; 

    //buildBasket();
    basket.forEach((beer, i) => {
      if(beer!=0){
        total += beer * jsonPrices[i].price;
      }
      }); 
  document.querySelector(".totalprice").textContent = total + " kr.";
}

function buildBasket(){
  console.log("build basket");

    document.querySelector("#menu").classList.add("hide"); 
    document.querySelector("#beer-single").classList.add("hide"); 
    document.querySelector("#basket-overview").classList.remove("hide"); 
    document.querySelector("#buttonbaskettomenu").addEventListener("click", updateInput); 

    //Rul til toppen
    window.scrollTo(0,0);

    //Ændre overskrift i header
    document.querySelector("#header h1").textContent = "Kurv";

    //Hvis der er nogle øl i kurven, skriv antal ud 
    if((basket.reduce((a,b) => a+b)) != 0){
      
    let container = document.querySelector(".basket-container");
    let temp = document.querySelector(".baskettemplate");

    //Nulstiller totalprisen 
    total = 0;

    //Tømmer HTML/kurven
    container.innerHTML = "";

    console.log(basket);
    basket.forEach((beer, i) => {
      //Hvis antallet af en bestemt øl er større end 0, så clon den 
      if(beer!=0){
      const clone = temp.cloneNode(true).content;
  
      //Opdater total pris
      total += beer * jsonPrices[i].price;

      //Input feltet viser id for den valgte øl 
      clone.querySelector("#beerbasket_").id = "beerbasket_" + i;
      clone.querySelector("#beerbasket_" + i).addEventListener("change", updateBasket); 
  
      clone.querySelector(".beer-image").src = `./img/beer/${jsonData[i].label}`;
      clone.querySelector(".beer-name").textContent = jsonData[i].name;
      clone.querySelector(".beer-price").textContent = jsonPrices[i].price + " kr.";
      clone.querySelector(".alc").textContent = jsonData[i].alc + "% alc.";
      clone.querySelector(".beer-amount").value = beer;

      //Fjern item fra kurv
      clone.querySelector("#removebutton_").id = "removebutton_" + i;
      clone.querySelector("#removebutton_" + i).addEventListener("click", updateBasket);
  
      container.appendChild(clone);
      }
  });

    //Skriv total pris ud
    document.querySelector(".totalprice").textContent = total + " kr.";
  }else{
    //Hvis kurven er tom - vis tom kurv side
    document.querySelector("#emptybasket-overview").classList.remove("hide");
    document.querySelector("#basket-overview").classList.add("hide");
  }
}

//Kaldes når man går fra kurv/singleview til menu og opdaterer inputfelterne med valgte antal øl
function updateInput(){
    document.querySelector("#menu").classList.remove("hide"); 
    document.querySelector("#basket-overview").classList.add("hide"); 
    document.querySelector("#beer-single").classList.add("hide"); 

    //Overskrift menu i header
    document.querySelector("#header h1").innerHTML = "Menu";

    //Løb gennem array og opdater antal øl
    basket.forEach((beer, i) => {

    //Tjek om øllen er på listen, hvis ja opdater value
    if(document.querySelector("#beer_" + i)!==null){
    document.querySelector("#beer_" + i).value = beer; 
    }
  });  
}

function listenForClickOnSubmit(){ 
  console.log("der er klikket på gå til betaling"); 
  document.querySelector("#basket-overview").classList.add("hide"); 
  document.querySelector("#basket-payment").classList.remove("hide");
  //document.querySelector(".betalordre").addEventListener("click", post);

  //Rul til toppen
  window.scrollTo(0,0);

  //Ændre overskrift i header
  document.querySelector("#header h1").textContent = "Betaling";
  document.querySelector("#header h1").style.fontSize = "3em"; 

  order = [];

  const form = document.querySelector("form"); 
  //console.log(basket);

  basket.forEach((beer, i) => {
  if(beer!=0){
    
  //Pusher object til array så det bliver json
  order.push({ name: jsonData[i].name, amount: beer });
  console.log(order); 
    }
});
    
    // export function sendData(){
    form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // const beertype = document.querySelector(".beertype"); 
    // const beeramount = document.querySelector(".beeramount"); 
    // console.log(e.elements.beertype.value); 
    // console.log(beeramount.value); 

  });
}

async function fetchBeerStatus(data){
  console.log(data)
  
  const endpoint = "https://teamellewoods.herokuapp.com/order"; 
  const tempdata = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }); 
  
  return await tempdata.json();
}

export async function post(){

  const endpoint = "https://teamellewoods.herokuapp.com/order"; 

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      //hent data.id
      console.log(data.id); 
      orderConfirmation(data.id);
    })
    .catch((error) => {
      console.error('Error:', error);
  });
}

function orderConfirmation(id){
console.log("tak for din ordre"); 
document.querySelector("#confirmation").classList.remove("hide");
document.querySelector("#basket-payment").classList.add("hide");

//Rul til toppen
window.scrollTo(0,0);

//Ændre overskrift i header
document.querySelector("#header h1").textContent = "Bekræftelse";
document.querySelector("#header h1").style.fontSize = "3em"; 

//Indsæt ordre id i tekst
document.querySelector(".ordreid").innerHTML = id;
console.log(id); 

//Tøm kurv og nulstil input
basket.forEach((beer, i) => {
  basket[i] = 0; 
  
});

document.querySelectorAll(".input-beer").forEach((beer) => {
  beer.value = 0; 
});

document.querySelector("#basketamount").innerHTML = 0;

//Nulstil inputfelter betaling
document.querySelector("#cardholder_name").value = "";
document.querySelector("#cardholder_name").style.backgroundColor = "";
document.querySelector("#cardholder_name").style.color = "none";

document.querySelector("#ccnum").value = "";
document.querySelector("#ccnum").style.backgroundColor = "";
document.querySelector("#ccnum").style.color = "none";


document.querySelector("#month").value = "";
document.querySelector("#month").style.backgroundColor = "";
document.querySelector("#month").style.color = "none";

document.querySelector("#year").value = "";
document.querySelector("#year").style.backgroundColor = "";
document.querySelector("#year").style.color = "none";

document.querySelector("#ccv").value = "";
document.querySelector("#ccv").style.backgroundColor = "";
document.querySelector("#ccv").style.color = "none";


document.querySelector(".buttontofrontpagefromconfirmation").addEventListener("click", () => {document.querySelector("#confirmation").classList.add("hide"); document.querySelector("#frontpage").classList.remove("hide"); document.querySelector("#header h1").textContent = "Menu"; //Rul til toppen
window.scrollTo(0,0);});

//Notifikation
setTimeout(showNotification, 5000); 
}

function showNotification(id){
  console.log("Din ordre er nu klar."); 
  document.querySelector("#confirmation").classList.add("hide");
  document.querySelector("#notifikation").classList.remove("hide");

  //Rul til toppen
window.scrollTo(0,0);

//Ændre overskrift i header
document.querySelector("#header h1").textContent = "Notifikation";
document.querySelector("#header h1").style.fontSize = "3em";  

document.querySelector(".buttontofrontpagefromnotification").addEventListener("click", () => {document.querySelector("#notifikation").classList.add("hide"); document.querySelector("#frontpage").classList.remove("hide"); document.querySelector("#header h1").textContent = "Menu";
}

)}; 
