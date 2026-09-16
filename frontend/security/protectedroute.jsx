import { useEffect, useState } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        fetch("http://localhost:8000/user/me", {
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
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;