import axios from "axios";

const storedToken = localStorage.getItem("token") || null;
let access_token = "";
console.log(storedToken);
console.log(typeof storedToken);

if (storedToken !== 'undefined' && storedToken !== "null"  && storedToken.length > 0) {
    access_token = JSON.parse(storedToken).access_token;
}
export const makeRequest = axios.create({

  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {'Authorization': 'Bearer '+ access_token}
});