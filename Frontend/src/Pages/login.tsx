import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginSchema } from "../schemas/auth.schema";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = (
    location.state as { message?: string } | null
  )?.message;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ||
          "Please check your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Login failed. Please check your details."
        );
      }

      if (!data?.token || !data?.user || !data.user.role) {
        throw new Error("The server returned an invalid login response.");
      }

      if (!["customer", "admin"].includes(data.user.role)) {
        throw new Error("Your account has an invalid user role.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/account", { replace: true });
      }
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please check your connection and try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-orange-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-black tracking-tight">
            Pendo<span className="text-orange-500">Hub</span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue shopping with PendoHub.
          </p>
        </div>

        {successMessage && (
          <p
            role="status"
            className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {successMessage}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 transition-colors focus-within:border-orange-500">
              <Mail size={18} className="shrink-0 text-gray-400" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 transition-colors focus-within:border-orange-500">
              <Lock size={18} className="shrink-0 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-gray-400 transition-colors hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                state={{ email }}
                className="text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;