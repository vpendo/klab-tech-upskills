import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail =
    (location.state as { email?: string } | null)?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Could not send the verification code."
        );
      }

      setSuccess(
        data?.message || "If the account is registered, check your email for the verification code."
      );

      navigate("/reset-password", {
        state: { email: email.trim().toLowerCase() },
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
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
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your registered email address to request a verification code.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 focus-within:border-orange-500">
              <Mail size={18} className="shrink-0 text-gray-400" />

              <input
                id="forgot-email"
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

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending code..." : "Send Verification Code"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}