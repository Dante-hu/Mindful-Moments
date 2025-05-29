// src/app/(app)/log-mood/page.tsx
"use client";
import { useState } from "react";
import { logMood } from "../api/auth";
import { useRouter } from "next/navigation";

export default function LogMood() {
  const [moodText, setMoodText] = useState("");
  const [response, setResponse] = useState<{ emotion: string; feedback: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to continue.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    try {
      const result = await logMood(token, moodText);
      setResponse({ emotion: result.emotion, feedback: result.feedback });
      setMoodText("");
    } catch (error: any) {
      setError(error.message || "Failed to log mood.");
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
        <h1 className="text-4xl font-bold text-center">Log Your Mood</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="moodText" className="sr-only">How are you feeling?</label>
          <textarea
            id="moodText"
            name="moodText"
            placeholder="How are you feeling?"
            required
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            className="w-full h-[100px] bg-transparent border border-white/30 rounded-[20px] text-white px-5 py-3 placeholder-white focus:outline-none my-6"
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
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Logging...
              </span>
            ) : (
              "Log Mood"
            )}
          </button>
        </form>
        {response && (
          <div className="mt-6 p-4 bg-white/10 rounded-[20px] animate-fade-in">
            <p className="font-bold">Emotion: {response.emotion}</p>
            <p>{response.feedback}</p>
          </div>
        )}
        <p className="text-sm text-center mt-4 text-gray-300">
          This app is not a substitute for professional mental health support. For urgent help, contact a helpline (e.g., 988 in the US).
        </p>
      </div>
    </div>
  );
}