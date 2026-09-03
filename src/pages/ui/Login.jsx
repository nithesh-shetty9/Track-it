import { useState } from "react";
import { BiSolidHide } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import "./user.css";
import { NavLink } from "react-router";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const passwordvalidation = (value) => {
    const passwordRegex = /^.{8,}$/;
    if (passwordRegex.test(value)) {
      setErrorMessage("");
      return true;
    } else {
      setErrorMessage("password must contain  atleast 8 characters");
      return false;
    }
  };
  const handleform = (event) => {
    event.preventDefault();
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
    passwordvalidation(event.target.value);
  };
  const handleshowpassword = () => {
    {
      setshowpassword((prev) => !prev);
    }
  };
  return (
    <div className="main-container">
      <form onSubmit={handleform}>
        <div className="login-box">
          <h1 className="heading">Welcome back!</h1>
          <div className="user-input">
            <label htmlFor="useremail">Email</label>
            <input
              type="email"
              required
              name="email"
              placeholder="enter your email"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="user-input">
            <div className="password-section">
              <label htmlFor="userpassword">Password</label>
              <input
                type={showpassword ? "text" : "password"}
                required
                name="password"
                placeholder="enter your password"
                value={password}
                onChange={handlePassword}
              />
              <button type="button" onClick={() => handleshowpassword()}>
                {!showpassword ? (
                  <BiSolidHide className="eye-icon" />
                ) : (
                  <FaEye className="eye-icon" />
                )}
              </button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
          <p className="error-text">
            Don't have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};
