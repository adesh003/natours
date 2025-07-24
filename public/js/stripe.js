import axios from "axios";
import { showAlert } from './alerts';

// const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Ro6UdJ3gAo9XRoH0AfnX0fv6hmdZD5xNK4sKWRoo17b6YsPJYMC6GuqVFpuqYlhVyXOm25BOIlXgr6HTRn138hK005RhUfEQB'); // replace with real one

export const bookTour = async tourId=>{


    try {
    // 1) Get checkout session from your API
    const session = await axios(`http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Redirect to Stripe checkout
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error' , err);
  }
}