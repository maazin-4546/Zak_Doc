import React from "react";
import { Navigate, Outlet } from "react-router";

function OnlyIfNotLoggedIn() {
    const token = localStorage.getItem('token');

    return token ? <Navigate to="/dashboard" /> : <Outlet />;
}

export default OnlyIfNotLoggedIn;
