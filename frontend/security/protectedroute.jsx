import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        fetch("http://localhost:8001/user/me", {
            credentials: "include"
        })
        .then((res) => {

            if (res.ok) {
                setAuthenticated(true);
            }

            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;