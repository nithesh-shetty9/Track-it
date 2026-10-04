import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { store } from "../store/store";
import { setUser } from "../store/features/user.js";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//refresh logic evn when refereshed it checks auth through cookies 
export const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:8001/user/me", {
      credentials: "include",
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          dispatch(setUser(data.user));
        }
      })
      .catch(() => {});
  }, [dispatch]);

  return children;
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthBootstrap>
      <App />
    </AuthBootstrap>
   </Provider>,
)
