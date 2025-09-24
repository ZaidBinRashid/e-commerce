// Import necessary hooks and libraries
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a Context object for authentication
const AuthContext = createContext();

// This component will wrap your entire app and provide authentication data to all components
export const AuthProvider = ({ children }) => {
  // 'user' will hold the logged-in user's data, initially null (not logged in)
  const [user, setUser] = useState(null);

  // This runs once when the app starts (or when AuthProvider mounts)
  useEffect(() => {
    // Try to fetch the currently logged-in user's profile from the backend
    axios
      .get("http://localhost:8080/api/auth/profile", { withCredentials: true }) 
      // withCredentials: true → ensures cookies (with the JWT) are sent with the request
      .then(res => setUser(res.data.user)) // If logged in, set the user state
      .catch(() => setUser(null)); // If not logged in or error, set user to null
  }, []);
  

  return (
    // Provide 'user' and 'setUser' to the whole app through AuthContext
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
