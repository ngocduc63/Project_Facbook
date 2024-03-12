import axios from "axios";


export const makeRequest = axios.create({

  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem("token")).access_token}
});
