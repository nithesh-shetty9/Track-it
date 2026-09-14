import "./landingpage.css";
import { GrInProgress } from "react-icons/gr";
import { useState } from "react";
import Signupin from "../auth/Signupin";
const Landingpage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  return (
    <div className="landingpage">
      <header className="landing-menu">
        <div className="logo">
          <GrInProgress />
          Track it
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-right">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button className="get-started"onClick={() => setShowSignup(true)}>Get started</button>
        </div>
      </header>
      {showLogin && (
        <div className="modal-overlay">
          <Signupin showLogin={true} setShowLogin={setShowLogin}
          showSignup={showSignup} setShowSignup={setShowSignup}/>
        </div>
      )}
      {showSignup && (
        <div className="modal-overlay">
          <Signupin showLogin={showLogin} 
          setShowLogin={setShowLogin} 
          showSignup={showSignup} 
          setShowSignup={setShowSignup} />
        </div>
      )}

    </div>
  );
};

export default Landingpage;