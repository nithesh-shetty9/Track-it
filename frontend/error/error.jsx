import { Link } from "react-router";
import "./error.css";

const ErrorPage = () => {
  return (
    <main className="notfound">
      <span className="notfound-code" aria-hidden="true">404</span>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link className="notfound-link" to="/home">
        Back to your workspace
      </Link>
    </main>
  );
};

export default ErrorPage;
