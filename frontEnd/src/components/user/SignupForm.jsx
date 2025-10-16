import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3).max(20).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
});

export default function SignupForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await SignupSchema.validate(form, { abortEarly: false });

      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        const err = await res.json();
        alert(err.message || "Signup failed");
      }
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {["username", "email", "password", "confirmPassword"].map((field) => (
        <div key={field}>
          <input
            type={field.includes("password") ? "password" : "text"}
            name={field}
            value={form[field]}
            placeholder={
              field === "confirmPassword"
                ? "Confirm Password"
                : field.charAt(0).toUpperCase() + field.slice(1)
            }
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
          />
          {errors[field] && (
            <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2 font-medium shadow-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Sign Up"}
      </button>
    </form>
  );
}
