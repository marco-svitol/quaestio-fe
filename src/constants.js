// src/constants.js
let apiBaseUrl = ""
if (process.env.NODE_ENV === "development") {
    apiBaseUrl = "http://localhost:8080";
}else{
    apiBaseUrl = "https://quaestio-be.azurewebsites.net";
}
console.log (`APIBASEURL: ${process.env.NODE_ENV}`);
export const API_BASE_URL = apiBaseUrl;