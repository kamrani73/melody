import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Home from "./pages/Home";
import Playlist from "./pages/PlayList";
import "./app.css";

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      {/* Fixed Navbar */}
      <nav className="p-4 bg-gray-100 flex justify-between fixed top-0 left-0 right-0 z-10 dark:bg-gray-800">
        <div>
          <Link
            to="/home"
            className="mr-4 text-blue-500 underline dark:text-white"
          >
            Home
          </Link>
          <Link
            to="/playlist"
            className="mr-4 text-blue-500 underline dark:text-white"
          >
            Playlist
          </Link>
          {!isAuthenticated() && (
            <>
              <Link
                to="/login"
                className="mr-4 text-blue-500 underline dark:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-500 underline dark:text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
        {isAuthenticated() && (
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
            className="text-red-500 underline dark:text-red-300"
          >
            Logout
          </button>
        )}
      </nav>

      <div className="  bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5 absolute inset-0">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist"
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
