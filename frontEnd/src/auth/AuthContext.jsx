import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);


useEffect(() => {
axios.get("http://localhost:8080/api/auth/profile", { withCredentials: true })
.then(res => setUser(res.data.user))
.catch(() => setUser(null));
}, []);


return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);