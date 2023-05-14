import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/Login";
import { Register } from "../components/Register";

function NonAuth() {
  return (
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/register" Component={Register} />
    </Routes>
  );
}

export default NonAuth;
