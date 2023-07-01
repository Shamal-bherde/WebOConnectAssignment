// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Users from "./components/Users";
import MyProfile from "./components/MyProfile";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Profile/:id" element={<MyProfile />} />
          <Route path="/Edit/:id" element={<EditProfile />} />
          <Route path="/Register" element={<Register />} />
          <Route exact path="/" element={<Login />} />
          <Route path="/Users" element={<Users/>} /> 
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
