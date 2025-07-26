import'@babel/polyfill'
import { login } from "./login";
import { bookTour } from './stripe';
import { logout } from './logout'; 
// import { updateSettings } from './updateSettings';
import { updateSettings } from './updateSettings';

// const mapBox = document.getElementById('map');
const loginForm= document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout')
const userdataForm= document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour')


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
    const form = new FormData();
    form.append('name',  document.getElementById('name').value)
    form.append('email',  document.getElementById('email').value)
    form.append('photo' , document.getElementById('photo').files[0])
    
    // const email = document.getElementById('email').value
    // const name = document.getElementById('name').value
    updateSettings(form,'data' )
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

if(bookBtn)
  bookBtn.addEventListener('click', e =>{
    e.target.textContent = 'Processing...'
  const {tourId }= e.target.dataset
  bookTour(tourId)
})