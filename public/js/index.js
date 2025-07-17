import'@babel/polyfill'
import { login } from "./login";

import { logout } from './logout'; 
import { updateData } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm= document.querySelector('.form--login');
const userdataForm= document.querySelector('.form-user-data');
const logOutBtn = document.querySelector('.nav__el--logout')
if(mapBox){
    const location = JSON.parse(mapBox.dataset.locations);
    displayMap(location);
}

if(loginForm)
 
    loginForm.addEventListener('submit' , e =>{
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})
if(logOutBtn) logOutBtn.addEventListener('click' , logout)

if(userdataForm)userdataForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value
    updateData(name ,email)
})