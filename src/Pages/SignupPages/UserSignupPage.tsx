import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { user_signup } from "../../Service/Auth";

function UserSignupPage() {
  const Navigate = useNavigate();
  const [Loading , Setloading] = useState(false);

  const validateUsernamePasswords = 
  (username: string, password1: string , password2: string) => {
        console.log("testsss");
        
      if(!username){
        toast.error("Enter a username")
        return false
      }
      else if(!password1){
        toast.error("Enter a password")
        return false
      }

      else if (username.includes(" ")){
        toast.error("username contains space")
        return false;
      }

      else if (password1.includes(" ")){
        toast.error("password contains space")
        return false;
      }

      else if (password1.length < 7){
        toast.error("password should contain at least 8 characters")
        return false;
      }

      else if (password1 != password2){
        toast.error("passwords don't match")
        return false;
      }

      else return true
    }

  const handleSubmit = (event: React.BaseSyntheticEvent) => {

    event.preventDefault();
    Setloading(true);

    const form = event.currentTarget as HTMLFormElement;

    const username_inp = form.elements.namedItem(
      "username"
    ) as HTMLInputElement;

    const password_inp1 = form.elements.namedItem(
      "password1"
    ) as HTMLInputElement;

    const password_inp2 = form.elements.namedItem(
      "password2"
    ) as HTMLInputElement;

    const username = username_inp.value;
    const password1 = password_inp1.value;
    const password2 = password_inp2.value;

    const validated = validateUsernamePasswords(username , password1 , password2)

    console.log("validated" , validated);
    

    if (!validated) return Setloading(false);
    if(validated){
        Setloading(true)

        user_signup(username , password1)

        .then(()=>{
          Setloading(false)
          toast.success("Account Created, please login")
          Navigate("/auth/login")
        })
        
        .catch(()=>{
          Setloading(false)
          toast.error("Unknown Error")
        })
    }

  }



  return (
    <div className="row viewport-height gap-1 justify-content-center align-items-center">
      <div className="col-md-6 col-12 col-lg-4 auth-div">
        <h1 className="app-color">Shippr Signup</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" />

          <label htmlFor="password1">Create Password</label>
          <input type="text" name="password1" />

          <label htmlFor="password2">Confirm Password</label>
          <input type="password" name="password2" />

          <button className="app-btn1" type="submit">
          { !Loading ? (
              "SignUp"
            ) : (
              <div className="lds-facebook auth-loader">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        </form>
        <p className="text-center auth-info">
          Have an account ? ,{" "}
          <span onClick={() => Navigate("/auth/login")}>Login now</span>{" "}
        </p>
      </div>
    </div>
  );
}

export default UserSignupPage;
