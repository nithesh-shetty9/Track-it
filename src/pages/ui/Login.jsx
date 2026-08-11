import { useState } from "react";
import "./user.css";
export const Login=()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[errorMessage, setErrorMessage] = useState('');
    const passwordvalidation=(value)=>{
        const passwordRegex = /^.{8,}$/;
        if(passwordRegex.test(value))
        {
        setErrorMessage('');
        return true;
        }
        else
        {
            setErrorMessage("password must contain 8 characters")
            return false;
        }
    }
    const handleform=((event)=>{
        event.preventDefault();
            if(passwordvalidation(password))
            {
            console.log(email,password);
            }
        
    })
    const handleEmail=((event)=>{
        setEmail(event.target.value);
    })
    const handlePassword=((event)=>{
        passwordvalidation(event.target.value);
         setPassword(event.target.value);
    })
    return(
    <div className="main-container">
        <form onSubmit={handleform}>
            <div className="box-content">
            <h1 className="heading">Welcome back!</h1>
            <div className="user-input">
                <label htmlFor="useremail">Email</label>
                <input type="email"required name="email"placeholder="enter your email"value={email}onChange={handleEmail}/>
            </div>
             <div className="user-input">
                <label htmlFor="userpassword">Password</label>
                <input type="password"required name="password"placeholder="enter your password"value={password} onChange={handlePassword}/>
                {errorMessage && <p>{errorMessage}</p>} 
            </div>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>);
}