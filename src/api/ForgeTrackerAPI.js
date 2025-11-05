import React from "react";
import axios from "axios";

export default axios.create({
  //   baseURL: "https://localhost:7064/api",
  //   baseURL: "https://172.20.10.2:7064/api",
  //ihpone hotspot
  //baseURL: "http://172.20.10.3:5082/api",

  //home wifi
  baseURL: "http://192.168.1.80:5082/api",
});
