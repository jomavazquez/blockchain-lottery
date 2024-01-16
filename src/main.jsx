import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LotteryApp } from "./LotteryApp";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LotteryApp />
  </BrowserRouter>,
);