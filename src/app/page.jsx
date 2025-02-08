"use client";
import { useState } from "react";
import "@/app/globals.css"; // Ensure Tailwind and fonts are loaded

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", formData);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/20.jpg')" }} 
    >
      <div className="w-[350px] bg-black text-white rounded-[30px] p-10">
        <h1 className="text-4xl font-bold text-center">Login</h1>
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
          <button type="submit" className="w-full h-[45px] bg-white text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 cursor-pointer">
            Login
          </button>
          <div className="text-sm text-center mt-5">
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-white font-medium underline">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
