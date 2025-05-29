"use client";
import { useState, useEffect } from "react";
import { getMoodHistory, clearMoodLogs } from "../api/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  interface MoodEntry {
    mood_text: string;
    emotion: string;
    feedback: string;
    timestamp: string;
  }

  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your dashboard.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }
      try {
        const response = await getMoodHistory(token);
        setMoods(response);
      } catch (error: any) {
        setError(error.message || "Failed to fetch mood history.");
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, [router]);

  const handleClearLogs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to clear mood logs.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    try {
      await clearMoodLogs(token);
      setMoods([]);
      setError("Mood logs cleared successfully.");
    } catch (error: any) {
      setError(error.message || "Failed to clear mood logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/20.jpg')" }}
    >
      <div className="w-[600px] bg-black text-white rounded-[30px] p-10">
        <h1 className="text-4xl font-bold text-center">Mood Dashboard</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <button
              onClick={handleClearLogs}
              className="w-full h-[45px] bg-white text-black rounded-[60px] font-bold shadow-md hover:bg-gray-200 transition-colors mt-6"
            >
              Clear Mood Logs
            </button>
            <div className="mt-6">
              <h2 className="text-2xl font-bold">Mood History</h2>
              {moods.length === 0 ? (
                <p>No moods logged yet.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {moods.map((mood, index) => (
                    <li key={index} className="p-4 bg-white/10 rounded-[20px]">
                      <p><strong>Mood:</strong> {mood.mood_text}</p>
                      <p><strong>Emotion:</strong> {mood.emotion}</p>
                      <p><strong>Feedback:</strong> {mood.feedback}</p>
                      <p><strong>Time:</strong> {new Date(mood.timestamp).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Chart placeholder - see below */}
            <p className="text-sm text-center mt-4 text-gray-300">
              This app is not a substitute for professional mental health support. For urgent help, contact a helpline (e.g., 988 in the US).
            </p>
          </>
        )}
      </div>
    </div>
  );
}