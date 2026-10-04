
import { useState } from "react";
import "./Signupin.css";
import api, { errorMessage } from "../../api/index.js";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/features/user.js";
const Signupin = ({ showLogin, setShowLogin, showSignup, setShowSignup }) => 
  { 
    const [error,seterror]=useState("");
    const [valid,setvalid]=useState(false);
    const [user,setuser]=useState({
      name:""
      ,email:"",
      password:"",
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleform=(async(event)=>{
      event.preventDefault();
      if(user.password.length<6)
      {
        setvalid(true);
        return;
      }
      else
      {
        setvalid(false);
      }
    try {
      const result = showLogin
        ? await api.login({ email: user.email, password: user.password })
        : await api.signup(user);
      dispatch(setUser(result.user));
      navigate("/home");
    } catch (failure) {
      seterror(errorMessage(failure));
    }
  })
  return (
      <form className="user-card-container" onSubmit={handleform}>
        <div className="user-card-header">
          <h1>{showLogin ? "Login" : "Sign Up"}</h1>
          <button type="button"
           className="close-button" 
              onClick={() => {
              setShowLogin(false);
              setShowSignup(false);
            }}
          >
            X
          </button>
        </div>
        <div className="user-input-fields">
          {showSignup && (
           <label className="user-input-field">Name<input type="text"
           value={user.name} 
           onChange={(e) => setuser({ ...user, name: e.target.value })}
           placeholder="enter your name" required /></label>
          )}
           <label className="user-input-field">Email<input type="email"
           onChange={(e) => setuser({ ...user, email: e.target.value })}
            value={user.email}
            placeholder="enter your email" required 
            /></label>
          <label className="user-input-field">Password<input type="password" 
          value={user.password}
          onChange={(e) => setuser({ ...user, password: e.target.value })}
          placeholder="enter your password" required /></label>
        </div>
        {
          valid&&
          <p className="password-invalid">password must have atleast 6 characters</p>
        }
        {
          error&&<p className="password-invalid">{error}</p>
        }
        <div className="login-popup-condition">
          <input type="checkbox" required  className="check-box"/>
          <p>I agree to the terms of use and privacy policy</p>
        </div>
        <button type="submit" className="user-submit-button">{showLogin ? "Login" : "Sign Up"}</button>
        {showLogin ? (
          <p className="login-signup-toggle">
            Create a new Account?
            <span className="login-signup-toggle-link"
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="login-signup-toggle">
            Already have an account?
            <span className="login-signup-toggle-link"
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            >
              Login here
            </span>
          </p>
        )}
      </form>
  );
};
export default Signupin;
