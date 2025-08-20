import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password }),
        credentials: "include", // send/receive cookies
      });

      if (res.ok) {
        alert("Signup successful!");
        navigate("/account"); // redirect to account page
      } else {
        const err = await res.json();
        alert(err.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignup} className="h-[62vh]  pt-50">
      <h2>Signup</h2>
      <input
        type="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      /><br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
