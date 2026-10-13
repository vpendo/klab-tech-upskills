
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        {/* Brand Section */}
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-black p-10 md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-600/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-600/20 blur-3xl" />

          <Link to="/" className="relative text-3xl font-extrabold text-white">
            Pendo<span className="text-orange-500">Hub</span>.
          </Link>

          <div className="relative">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Find Your Style
            </p>
            <h1 className="text-5xl font-extrabold leading-tight text-white">
              Your style.
              <br />
              Your <span className="text-orange-500">story.</span>
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-gray-300">
              Discover fashionable clothes and shoes for men and women.
              Create your account and start exploring PendoHub.
            </p>
          </div>

          <p className="relative text-sm text-gray-500">
            Fashion that fits your lifestyle.
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 inline-block text-2xl font-extrabold text-black md:hidden"
            >
              Pendo<span className="text-orange-600">Hub</span>.
            </Link>

            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
              Join PendoHub
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign up to discover your next favorite look.
            </p>

            {error && (
              <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 transition focus-within:border-orange-600">
                  <UserRound size={19} className="shrink-0 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-gray-700">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 transition focus-within:border-orange-600">
                  <LockKeyhole size={19} className="shrink-0 text-gray-400" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="h-12 w-full bg-transparent text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-gray-400 hover:text-orange-600"
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
              <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
