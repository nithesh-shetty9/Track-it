import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../api/index.js";
import { logout } from "../store/features/user.js";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return async () => {
    try {
      await api.logout();
    } finally {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };
};
