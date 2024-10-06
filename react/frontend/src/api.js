// src/api.js
import axios from 'axios'; // Add this line to import axios

const api = axios.create({
  baseURL: "http://localhost:8080/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
