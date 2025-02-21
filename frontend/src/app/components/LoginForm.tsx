"use client";
import { useState } from "react";
import { login } from "../api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      // Get Firebase ID token for Flask API calls
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      router.push("/dashboard");
    } catch (error) {
      const err = error as { code: string; message: string }; // Firebase error structure
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email. Please register first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address. Please enter a valid email.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative w-full h-[50px] my-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-full bg-transparent border border-white/30 rounded-[40px] text-white px-5 placeholder-white focus:outline-none"
            />
          </div>
          <div className="relative w-full h-[50px] my-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full h-full bg-transparent border border-white/30 rounded-[40px] text-white px-5 placeholder-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[45px] ${
              loading ? "bg-gray-500" : "bg-white"
            } text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 cursor-pointer`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-sm text-center mt-5">
            <div>
              Don't have an account?{" "}
              <Link href="/register" className="text-white font-medium underline">
                Register here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}