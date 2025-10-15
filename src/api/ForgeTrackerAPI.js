import React from "react";
import axios from "axios";

export default axios.create({
  //   baseURL: "https://localhost:7064/api",
  //   baseURL: "https://172.20.10.2:7064/api",
  baseURL: "http://172.20.10.2:5082/api",
});
