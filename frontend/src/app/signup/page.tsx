
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AtSign,
} from "lucide-react";

interface SignupForm {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const initialForm: SignupForm = {
  name: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";

  const wrapperClass =
    "flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20";

  function updateField(field: keyof SignupForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  function validateForm(): string | null {
    const name = form.name.trim();
    const email = form.email.trim();
    const username = form.username.trim();

    if (
      !name ||
      !email ||
      !username ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill in all required fields.";
    }

    if (name.length < 2 || name.length > 160) {
      return "Name must contain between 2 and 160 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || email.length > 254) {
      return "Please enter a valid email address.";
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

    if (!usernameRegex.test(username)) {
      return "Username must be 3-30 characters and contain only letters, numbers or underscores.";
    }

    if (form.password.length < 8 || form.password.length > 72) {
      return "Password must contain between 8 and 72 characters.";
    }

    if (!/[A-Z]/.test(form.password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(form.password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(form.password)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(form.password)) {
      return "Password must contain at least one special character.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      router.replace("/signin?registered=true");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <UserPlus size={27} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Register to access the Scheduler Console
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Full name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
              Full name
            </label>

            <div className={wrapperClass}>
              <User size={18} className="shrink-0 text-slate-400" />

              <input
                id="name"
                type="text"
                autoComplete="name"
                maxLength={160}
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
              Email address
            </label>

            <div className={wrapperClass}>
              <Mail size={18} className="shrink-0 text-slate-400" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-300">
              Username
            </label>

            <div className={wrapperClass}>
              <AtSign size={18} className="shrink-0 text-slate-400" />

              <input
                id="username"
                type="text"
                autoComplete="username"
                minLength={3}
                maxLength={30}
                required
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                placeholder="Choose a username"
                className={inputClass}
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              3-30 characters. Letters, numbers and underscores only.
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className={wrapperClass}>
              <Lock size={18} className="shrink-0 text-slate-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Create a strong password"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="shrink-0 text-slate-400 transition hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
              Minimum 8 characters, including uppercase, lowercase, number and special character.
            </p>
          </div>

          {/* Confirm password - no eye button */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
              Confirm password
            </label>

            <div className={wrapperClass}>
              <Lock size={18} className="shrink-0 text-slate-400" />

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Re-enter your password"
                className={inputClass}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
