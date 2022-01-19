import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./views/Home";
import Login from "./views/Login";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
