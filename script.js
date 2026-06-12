/*let name="dia";
var age=20;
const height=5.5;
console.log(name);
console.log(age);
console.log(age+5);
console.log(age-5);
console.log(age*2);
console.log(age/2);
console.log(age%3);
age+=3;
console.log(age);
age-=2;
console.log(age);
age*=2;
console.log(age);
age/=2;
console.log(age);
age%=3;
console.log(age);
console.log(height);
let age1=30;
console.log(age>age1);
console.log(age<age1);
console.log(age>=age1);
console.log(age<=age1);
console.log(age==age1);
console.log(age!=age1);
let food="pizza";
let breakfast="dosa";
let food1="idly";
let food2="dosa";
let food3="upma";
let food4="paratha";
if(breakfast==food)
{
    console.log("Enjoy your " + food + "!");
}
else if(breakfast==food1)
{
    console.log("Enjoy your " + food1 + "!");
}
else if(breakfast==food2)
{
    console.log("Enjoy your " + food2 + "!");
}
else if(breakfast==food3)
{
    console.log("Enjoy your " + food3 + "!");
}
else if(breakfast==food4)
{
    console.log("Enjoy your " + food4 + "!");
}
else
{
    console.log("Sorry, " + food + " is not available for breakfast.");
}*/
/*let amount=4800;
let notes=0;
let reminder=0;
if(amount>=500){
    notes=(amount/500);
    reminder=amount%500;
    console.log("Number of 500 notes: " + notes);
    console.log("Remaining amount: " + reminder);
}
if(reminder>=200){
    notes=(reminder/200);
    reminder=reminder%200;
    console.log("Number of 200 notes: " + notes);
    console.log("Remaining amount: " + reminder);
}
if(reminder>=100){
    notes=(reminder/100);
    reminder=reminder%100;
    console.log("Number of 100 notes: " + notes);
    console.log("Remaining amount: " + reminder);
}*/
/*for(let i=1;i<=5;i++)
{
    console.log(i);
}
let k=0;
while(k<30)
{
    console.log(k);
    k++;
}*/
/*
let user_name="chaithu";
let password="12345";
let name="dia";
let pin="pizza";
let frd="komala";
let pass="12345"
    if(name=="dia"){
    if(pin=="pizza"){
        console.log("Welcome " + name + "!");
}
    }*/
/*for(let i=1;i<=10;i++){
    for(let j=1;j<=10;j++){
        console.log(i + " * " + j + " = " + (i*j));
    }

}

let n=3;
let last=0;
for(let i=1;i<=n;i+2){
    last=i;
}
console.log("the last gift will be for " + last);
function cook()
{
    console.log("Cooking...");
    console.log("Food is ready!");
    console.log("Enjoy your meal!");
    console.log("Thank you for dining with us!");
    console.log("Have a great day!");
    console.log("Please come again!");
}
for(let i=0;i<5;i++){
    cook();
}
function dishwash( dishes){
    console.log("Washing " + dishes + " dishes...");


}
dishwash(2)
function add(a,b){
    return a+b;
}
let sum=add(5,10);
console.log("The sum is: " + sum);
function guess(n) {
    let userGuess = Number(prompt("Enter a number:"));

    if (userGuess == n) {
        console.log("Congratulations! You guessed the number.");
    } else if (userGuess < n) {
        console.log("Too low! Try again. ");
        guess(n);
    } else {
        console.log("Too high! Try again. ");
        guess(n);
    }
}

let number = Math.floor(Math.random() * 100) + 1;
guess(number);

/*function num(n){
    if(n>10){
        return;

    }
    console.log(n);
    n+=1;
    num(n);
}
num(1);*/
let chocolate=["melody","dairy milk","perk","kitkat","munch","5 star"];
let sales={
    dia:chocolate[0],
    chaithu:chocolate[1],
    dolly:chocolate[2],
    ashikha:chocolate[3],
    swathi:chocolate[4],
    anusha:chocolate[5]
};
console.log(sales);