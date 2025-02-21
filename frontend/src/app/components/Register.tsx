"use client";
import { useState } from "react";
import { register } from "../api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
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
      await register(formData.email, formData.password);
      alert("Registration successful!");
      router.push("/dashboard");
    } catch (error) {
      const err = error as { code: string; message: string };
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else {
        setError("Registration failed. Please try again.");
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
        <h1 className="text-4xl font-bold text-center">Register</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
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
              placeholder="Password (min 6 characters)"
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
            } text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 transition-colors`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-sm text-center mt-5">
            <div>
              Already have an account?{" "}
              <Link href="/login" className="text-white font-medium underline hover:text-purple-200">
                Login here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}