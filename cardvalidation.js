"use strict"; 

import {post} from "./form";

let cardholdername = false; 
let cardnumber = false;
let cardexpire = false;
let cardcvc = false;

import payform from "payform"; 
//var payform = require('payform');
console.log(payform);

//Validate card holders name
var inputname = document.getElementById('cardholder_name');
inputname.addEventListener("change", () =>{
    if(inputname.value){
        cardholdername = true; 
        console.log(cardholdername);
        inputname.style.backgroundColor = "darkgreen"; 
        inputname.style.color = "white"; 
        
    } else {
        cardholdername = false; 
        console.log(cardholdername);
        inputname.style.backgroundColor = "brown"; 
        inputname.style.color = "white"; 

    }
    //console.log(inputname.value); 
    activatePayButton(); 
});


// Format input for card number entry
var input = document.getElementById('ccnum');
payform.cardNumberInput(input);

// Validate a credit card number
input.addEventListener("blur", ()=>{
const valid = payform.validateCardNumber(input.value); //=> true
console.log(input.value, valid); 

if(valid){
cardnumber = valid; 
    input.style.backgroundColor = "darkgreen"; 
    input.style.color = "white"; 
    
}else {
    cardnumber = false; 
    input.style.backgroundColor = "brown"; 
    input.style.color = "white"; 

}
activatePayButton();
// Get card type from number
console.log(payform.parseCardType(input.value)); //=> 'visa'; 
});


//Valider MM/YY
var inputmonth = document.getElementById('month');
var inputyear = document.getElementById('year');

inputyear.addEventListener("blur", ()=>{
const validyear = payform.validateCardExpiry(inputmonth.value, inputyear.value); //=> true

if(validyear){
cardexpire = validyear; 
inputmonth.style.backgroundColor = "darkgreen";
inputmonth.style.color = "white";
inputyear.style.backgroundColor = "darkgreen";
inputyear.style.color = "white";

}
else {
    cardexpire = false; 
    inputmonth.style.backgroundColor = "brown"; 
    inputmonth.style.color = "white"; 
    inputyear.style.backgroundColor = "brown"; 
    inputyear.style.color = "white"; 
}
activatePayButton();
console.log(inputmonth.value, inputyear.value, validyear); 
} ); 


//Valider CVC 
var inputccv = document.getElementById('ccv');

inputccv.addEventListener("blur", ()=>{
    const validccv = payform.validateCardCVC(inputccv.value, input.value); //=> true

    cardcvc = validccv; 
    if(validccv){
        inputccv.style.backgroundColor = "darkgreen";
        inputccv.style.color = "white";
    
    } else {
        inputccv.style.backgroundColor = "brown";
        inputccv.style.color = "white";
    }
    activatePayButton();
    console.log(inputccv.value, input.value, validccv); 
} ); 

function activatePayButton(){

    if(cardholdername && cardnumber && cardexpire && cardcvc){
        document.querySelector(".betalordre").addEventListener("click", post);
        console.log("addevetlistnere");
    } else {
        document.querySelector(".betalordre").removeEventListener("click", post);
        console.log("removeeventliste");
    }

}



