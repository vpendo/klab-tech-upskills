
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import api from "../services/api";
import { registerSchema } from "../schemas/auth.schema";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const result = registerSchema.safeParse({
      name,
      email,
      password,
    });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ||
          "Please check your details."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", result.data);

      navigate("/login", {
        replace: true,
        state: {
          message: "Your account has been created. You can now log in.",
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            (err.response
              ? "Registration failed. Please check your details and try again."
              : "Unable to connect to the server. Please check your connection and try again.")
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
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-10">
        <Link
          to="/"
          className="mb-8 inline-block text-3xl font-extrabold text-black"
        >
          Pendo<span className="text-orange-600">Hub</span>.
        </Link>

        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
          Join PendoHub
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign up to discover your next favorite look.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 transition focus-within:border-orange-600">
              <UserRound size={19} className="shrink-0 text-gray-400" />

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="h-12 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 transition focus-within:border-orange-600">
              <Mail size={19} className="shrink-0 text-gray-400" />

              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 transition focus-within:border-orange-600">
              <LockKeyhole size={19} className="shrink-0 text-gray-400" />

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="h-12 w-full bg-transparent text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-400 transition hover:text-orange-600"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-orange-600 hover:text-orange-700"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
