import'@babel/polyfill'
import { login } from "./login";


const mapBox = document.getElementById('map');
const loginForm= document.querySelector('.form');

if(mapBox){
    const location = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(loginForm)
    loginForm.addEventListener('submit' , e =>{
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})