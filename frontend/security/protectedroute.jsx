import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { Skeleton } from "../components/Common";

const ProtectedRoute = () => {
  const { user, ready } = useSelector((state) => state.auth);

  if (!ready) {
    return (
      <div className="boot">
        <Skeleton rows={3} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
