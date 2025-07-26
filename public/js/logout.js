// logout.js
import axios from 'axios';
import { showAlert } from './alerts'; // optional

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
        withCredentials: true

    });

    if (res.data.status === 'success') {
      window.location.href = '/'; // ✅ redirect to homepage or login
    }
  } catch (err) {
    showAlert('error', 'Logout failed. Try again!');
  }
};
