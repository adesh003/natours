import'@babel/polyfill'
import { login } from "./login";

import { logout } from './logout'; 
// import { updateSettings } from './updateSettings';
import { updateSettings } from './updateSettings';

// const mapBox = document.getElementById('map');
const loginForm= document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout')
const userdataForm= document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');



// if(mapBox){
//     const location = JSON.parse(mapBox.dataset.locations);
//     displayMap(location);
// }

if(loginForm)
 
    loginForm.addEventListener('submit' , e =>{
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})
if(logOutBtn) logOutBtn.addEventListener('click' , logout)

if(userdataForm)
    userdataForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value
    updateSettings({name, email},'data' )
})


  if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmpassword = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, confirmpassword },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });