import axios from "axios";

// Make sure this matches your backend URL
const BASE_URL = "http://127.0.0.1:8000"; 

export const fetchCart = () =>
  axios.get(`${BASE_URL}/cart/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

export const addToCart = (headset_id, quantity = 1) =>
  axios.post(`${BASE_URL}/cart/add/`, 
    { headset_id, quantity }, 
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  );

export const updateCartItem = (cart_id, quantity) =>
  axios.put(`${BASE_URL}/cart/item/${cart_id}/`,
    { quantity },
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  );

export const removeCartItem = (cart_id) =>
  axios.delete(`${BASE_URL}/cart/item/${cart_id}/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
