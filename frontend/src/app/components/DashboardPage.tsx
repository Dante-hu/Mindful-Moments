"use client";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getMoodLogs } from "../lib/firebase";
import AuthRoute from "./AuthRoute";

// Define the type for mood logs
interface MoodLog {
  mood: string;
  notes?: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      getMoodLogs(auth.currentUser.uid).then((logs) => {
        // Ensure logs have the required structure
        const formattedLogs = logs.map((log) => ({
          mood: log.mood || "No mood recorded", // Fallback if mood is missing
          notes: log.notes || "", // Optional field
          timestamp: log.timestamp.toDate(), // Convert Firestore timestamp
        }));
        setMoodLogs(formattedLogs);
      });
    }
  }, [auth.currentUser]);

  return (
    <AuthRoute>
            <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Mood Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood Log Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Log Your Mood</h2>
          {/* Add mood form components here */}
        </div>

        {/* Mood History */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Mood History</h2>
          {moodLogs.map((log, index) => (
            <div key={index} className="border-b py-2">
              <p>
                {log.mood} - {log.timestamp.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </AuthRoute>
  );
}