import axios from "axios";

const api = axios.create({
  baseURL: "https://vabnapotro-api.onrender.com",
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

export default api;