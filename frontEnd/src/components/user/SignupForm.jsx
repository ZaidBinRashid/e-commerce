import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from "react-icons/hi";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
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
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setServerError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      await SignupSchema.validate(form, { abortEarly: false });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Show success and redirect
        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // You might want to auto-login the user here or redirect to login
        alert("Account created successfully! Please login.");
        // Optionally switch to login tab or navigate
      } else {
        setServerError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        setServerError("Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "johndoe",
      icon: HiUser,
      autoComplete: "username",
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      icon: HiMail,
      autoComplete: "email",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "At least 8 characters",
      icon: HiLockClosed,
      autoComplete: "new-password",
      showToggle: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      placeholder: "Re-enter your password",
      icon: HiCheckCircle,
      autoComplete: "new-password",
      showToggle: true,
    },
  ];

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {/* Server Error Message */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Form Fields */}
      {fields.map((field) => {
        const Icon = field.icon;
        const isPasswordField = field.name === "password";
        const isConfirmPasswordField = field.name === "confirmPassword";
        const shouldShowPassword = isPasswordField
          ? showPassword
          : isConfirmPasswordField
          ? showConfirmPassword
          : false;

        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={
                  field.type === "password" && shouldShowPassword
                    ? "text"
                    : field.type
                }
                name={field.name}
                value={form[field.name]}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                required
                onChange={handleChange}
                className={`w-full pl-10 ${
                  field.showToggle ? "pr-12" : "pr-4"
                } py-3 rounded-xl border ${
                  errors[field.name]
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-amber-500"
                } focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
              />
              {field.showToggle && (
                <button
                  type="button"
                  onClick={() =>
                    isPasswordField
                      ? setShowPassword(!showPassword)
                      : setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {shouldShowPassword ? (
                    <HiEyeOff className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            {errors[field.name] && (
              <p className="text-xs text-red-600 mt-1 ml-1">
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-2 font-medium">
          Password Requirements:
        </p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                form.password.length >= 6 ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            At least 8 characters
          </li>
          <li className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                form.password === form.confirmPassword &&
                form.password.length > 0
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></span>
            Passwords match
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-3 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-slate-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Terms Notice */}
      <p className="text-xs text-center text-gray-500 mt-4">
        By signing up, you agree to our{" "}
        <button type="button" className="text-amber-600 hover:text-amber-700">
          Terms of Service
        </button>{" "}
        and{" "}
        <button type="button" className="text-amber-600 hover:text-amber-700">
          Privacy Policy
        </button>
      </p>
    </form>
  );
}