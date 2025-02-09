"use client";
import { useState } from "react";
import "@/app/globals.css"; // Ensure Tailwind and fonts are loaded
import { register } from "../api/auth"; // Import the register function
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(false); // State to handle loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true); // Set loading state to true

    try {
      await register(formData.username, formData.password); // Call the register function
      alert("Registration successful!"); // Notify the user
      window.location.href = "/"; // Redirect to the login page
    } catch (err) {
      setError("Registration failed. Please try again."); // Display error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/20.jpg')" }}
    >
      <div className="w-[350px] bg-black text-white rounded-[30px] p-10">
        <h1 className="text-4xl font-bold text-center">Register</h1>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative w-full h-[50px] my-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
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
            disabled={loading} // Disable the button while loading
            className={`w-full h-[45px] ${
              loading ? "bg-gray-500" : "bg-white"
            } text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 cursor-pointer`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-sm text-center mt-5">
            <div>
              Already have an account?{" "}
              <Link href="/" className="text-white font-medium underline">
                Login here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}