import React, { useState, useCallback , useContext } from "react";
import { toast } from "react-hot-toast";
import { vendor_login } from "../../Service/Auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App/App";


function VendorLoginPage() {
  const [Loading, Setloading] = useState(false);
  const { setUserData } = useContext(UserContext)
  const Navigate = useNavigate()

  const validateUsernamePassword = useCallback(
    (username: string, password: string) => {
      if (!username) {
        toast.error("Enter a username");
        return false;
      }
      if (!password) {
        toast.error("Enter a username");
        return false;
      }

      if (username.includes(" ")) {
        toast.error("username contains space");
        return false;
      }

      if (password.includes(" ")) {
        toast.error("password contains space");
        return false;
      }

      return true;
    },
    []
  );

  const handleSubmit = useCallback((event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    Setloading(true);
    const form = event.currentTarget as HTMLFormElement;
    const username_inp = form.elements.namedItem(
      "username"
    ) as HTMLInputElement;
    const password_inp = form.elements.namedItem(
      "password"
    ) as HTMLInputElement;

    const username = username_inp.value;
    const password = password_inp.value;

    if (validateUsernamePassword(username, password)) {
      Setloading(true);
      vendor_login(username, password)

        .then(res => {
          Setloading(false)
          localStorage.setItem("logged_user" , JSON.stringify(res.data.user))
          localStorage.setItem("access-token" , res.data.access_token)
          localStorage.setItem("refresh-token" , res.data.refresh_token)
          localStorage.setItem("is_vendor" , "true")
          setUserData && setUserData(res.data.user)

          toast.success("Logged in")
          Navigate('/vendor/')
        })

        .catch((err) => {

          Setloading(false)
          if (err.response.data.message) {
            toast.error(err.response.data.message);
          }
           else {
            toast.error("Unknown Error");
          }

        });
    }
  }, []);

  return (
    <div className="row viewport-height gap-1 justify-content-center align-items-center">
      <div className="col-md-6 col-12 col-lg-4 auth-div">
        <h1 className="app-color">Shippr Vendor</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" />

          <label htmlFor="password2">Password</label>
          <input type="password" name="password" />

          <button className="app-btn1" type="submit" disabled={Loading}>
            {!Loading ? (
              "Login"
            ) : (
              <div className="lds-facebook auth-loader">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VendorLoginPage;
