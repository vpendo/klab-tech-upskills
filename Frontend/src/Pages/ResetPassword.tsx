import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail =
    (location.state as { email?: string } | null)?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!email.trim() || !otp.trim() || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError("Your password must be between 8 and 72 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
            newPassword,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Could not reset your password."
        );
      }

      setSuccess(
        data?.message ||
          "Password reset successfully. You can now log in."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message: "Password reset successfully. Please log in with your new password.",
          },
        });
      }, 1500);
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
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-black tracking-tight">
            Pendo<span className="text-orange-500">Hub</span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your email, the 6-digit verification code, and your new password.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="reset-otp"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Verification Code
            </label>

            <input
              id="reset-otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="reset-new-password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>

            <input
              id="reset-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting password..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Didn't receive a code?{" "}
          <Link
            to="/forgot-password"
            state={{ email }}
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Request another
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}