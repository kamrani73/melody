import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist"; // Updated import to match file name
import './app.css';

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex justify-between">
        <div>
          <Link to="/home" className="mr-4 text-blue-500 underline">
            Home
          </Link>
          <Link to="/playlist" className="mr-4 text-blue-500 underline">
            Playlist
          </Link>
          <Link to="/login" className="mr-4 text-blue-500 underline">
            Login
          </Link>
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </div>
        {isAuthenticated() && (
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login"; // Redirect to login after logout
            }}
            className="text-red-500 underline"
          >
            Logout
          </button>
        )}
      </nav>
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
    </Router>
  );
};

export default App;
