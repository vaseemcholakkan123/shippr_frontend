import "./index.css";
import React, { useEffect, useState } from "react";
import { user, user_context_type } from "../Types/Types";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../Pages/ProtectedRoute/ProtectedRoute";
import UserLoginPage from "../Pages/LoginPages/UserLoginPage";
import UserSignupPage from "../Pages/SignupPages/UserSignupPage";
import VendorLoginPage from "../Pages/LoginPages/VendorLoginPage";
import VendorRoutes from "../Pages/Vendor/VendorRoutes";
import UserRoutes from "../Pages/User/UserRoutes";
import { Toaster } from 'react-hot-toast'

export const UserContext = React.createContext<user_context_type>({
  user: null,
  setUserData: null,
});

function App() {
  const [user, setUserData] = useState<user | null>(null);

  useEffect(() => {
    let local_user = localStorage.getItem("logged_user");
    if (local_user && !user) setUserData(JSON.parse(local_user));
    
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user: user, setUserData: setUserData }}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={< UserRoutes />} />
            <Route path="/vendor/*" element={ <ProtectedRoute> <VendorRoutes /> </ProtectedRoute> } />
            <Route path="/auth/login" element={ user ? <Navigate to={'/'} /> : <UserLoginPage /> } />
            <Route path="/auth/signup" element={ <UserSignupPage /> } />
            <Route path="/auth/vendor-login" element={ user ? <Navigate to={'/'} /> : <VendorLoginPage /> } />

          </Routes>
        </BrowserRouter>

        <Toaster />
      </UserContext.Provider>
    </>
  );
}

export default App;
