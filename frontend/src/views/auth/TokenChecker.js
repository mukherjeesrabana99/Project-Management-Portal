import axios from 'axios';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const RefreshToken = (refreshToken) => {
  var bodyFormData = new FormData();
  bodyFormData.append('refresh', refreshToken);
  axios
    .post(BACKEND_URL + 'refresh', bodyFormData)
    .then((res) => {
      // sessionStorage.setItem('accessToken', res.data.token);
      // sessionStorage.setItem('accessTokenTime', new Date().getTime());
      Cookies.set('accessToken', res.data.token);
      Cookies.set('accessTokenTime', new Date().getTime());
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
};

export const CheckToken = () => {
  // if (sessionStorage.getItem('accessToken') !== undefined && sessionStorage.getItem('accessToken') !== null) {
  if (Cookies.get('accessToken') !== undefined && Cookies.get('accessToken') !== null) {
    var jwtExpTime = jwtDecode(Cookies.get('accessToken')).exp;
    var currentTime = new Date().getTime() / 1000;

    if (currentTime > jwtExpTime) {
      RefreshToken(Cookies.get('refreshToken'));
    }
    return true;
  }
  return false;
};
