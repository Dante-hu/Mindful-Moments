"use client";
import { useState } from "react";
import { login } from "../api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await login(formData.username, formData.password);
      localStorage.setItem("token", response.access_token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/log-mood"), 2000);
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/20.jpg')" }}
    >
      <div className="w-[350px] bg-black text-white rounded-[30px] p-10">
        <h1 className="text-4xl font-bold text-center">Login</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm text-center mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full h-[50px] bg-transparent border border-white/30 rounded-[40px] text-white px-5 placeholder-white focus:outline-none my-6"
          />
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full h-[50px] bg-transparent border border-white/30 rounded-[40px] text-white px-5 placeholder-white focus:outline-none my-6"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[45px] ${
              loading ? "bg-gray-500" : "bg-white"
            } text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 transition-colors flex items-center justify-center`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
          <div className="text-sm text-center mt-5">
            Don’t have an account?{" "}
            <Link href="/register" className="text-white font-medium underline hover:text-purple-200">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}