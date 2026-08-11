import { NavLink } from "react-router";
import "./user.css";
import { BiSolidHide } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
export const Signup=()=>{
    const [name,setname]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmpassword,setConfirmPassword]=useState("");
    const[passwordError, setPasswordError] = useState('');
    const [confirmPasswordError,setConfirmPasswordError]=useState('');
    const[showpassword,setshowpassword]=useState(false);
    const [showconfirmpassword,setshowconfirmpassword]=useState(false);
    const handleform=((event)=>{
    event.preventDefault();
    const passwordValid = validatepassword(password);
    const confirmValid = validateconfirmpassword(confirmpassword);

    if (passwordValid && confirmValid) {
        // default
        console.log(name,email,password,confirmpassword);
    }
}
);
// const handlePassword = (e) => {
//   const value = e.target.value;

//   setPassword(value);
//   validatePassword(value);
// };
    const validatepassword=(password)=>{
        const passwordRegex = /^.{8,}$/;
        if(passwordRegex.test(password))
        {
           setPasswordError('');
           return true;
        }
        else
        {
             setPasswordError("Password must contain atleast 8 characters");
             return false;
        }
    };
    const validateconfirmpassword=(confirmPassword)=>{
        if(password===confirmPassword)
        {
            setConfirmPasswordError('');
            return true;
        }
        else
        {
            setConfirmPasswordError("Password is not matching");
            return false;
        }
    }
    return(
    <div className="main-container">
        <div className="Signup-box">
            <form onSubmit={handleform}>
        <h1 className="heading">Welcome to Track-it!</h1>
        <div className="user-input">
            <label htmlFor="username">Name</label>
            <input type="text" id="username" name="username"placeholder="Enter your name"value={name} onChange={(e) => setname(e.target.value)} />
        </div>
        <div className="user-input">
            <label htmlFor="useremail">Email</label>
            <input type="email" id="useremail" name="email"placeholder="Enter your email"value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="user-input">
             <div className="password-section">
            <label htmlFor="userpassword">Password</label>
            <input type={showpassword ? "text" : "password"} id="userpassword" name="password"placeholder="Enter your password"value={password} onChange={(e) =>
            {
                setPassword(e.target.value)
                validatepassword(e.target.value);}}
            />
            <button type="button" onClick={() => setshowpassword(prev => !prev)}>
                {!showpassword ? <BiSolidHide /> : <FaEye />}
            </button>
             {passwordError && <p>{passwordError}</p>}
            </div>
            </div>
        <div className="user-input">
            <div className="password-section">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input type={showconfirmpassword ? "text" : "password"} id="confirmpassword" 
            name="confirmpassword"
            placeholder="Confirm your password"
            value={confirmpassword} 
            onChange={(e) => {setConfirmPassword(e.target.value)
                validateconfirmpassword(e.target.value);}}
            />
            <button type="button" onClick={() => setshowconfirmpassword(prev => !prev)}>
                {!showconfirmpassword ? <BiSolidHide /> : <FaEye />}
            </button>
            {confirmPasswordError && <p>{confirmPasswordError}</p>}
            </div>
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
        <p className="error-text">Already have an account? <NavLink to="/login">Login</NavLink></p>
     </form>
     </div>
    </div>

    );
}