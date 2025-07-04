/* eslint-disable no-unused-vars */
import { createContext } from "react";

const hostname = window.location.hostname;
let dynamicBaseAPI = "";
let dynamicBaseURL = "";

if (hostname.startsWith("192.168.9.")) {
  dynamicBaseAPI = "http://192.168.9.208:3000/api";
  dynamicBaseURL = "http://192.168.9.208:3000/";
} else if (hostname.startsWith("192.168.10.")) {
  dynamicBaseAPI = "http://192.168.10.208:3000/api";
  dynamicBaseURL = "http://192.168.10.208:3000";
} else if (hostname === "localhost" || hostname === "127.0.0.1") {
  dynamicBaseAPI = "http://localhost:3000/api";
  dynamicBaseURL = "http://localhost:3000";
} else {
  dynamicBaseAPI = "http://192.168.10.208:3000/api";
}

export const ApiUrl = createContext(dynamicBaseAPI);
export const UrlBaseBackend = createContext(dynamicBaseURL);
export const apiUrl = dynamicBaseAPI;
export const baseUrl = dynamicBaseURL;
