// app/page.jsx
"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function Home() {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // Trigger animation when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="bg-gradient-to-b from-purple-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold mb-4"
        >
          Mindful Moments
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl mb-8"
        >
          Your personal mood journal and stress management companion.
        </motion.p>
        <Link href="/register">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-all"
          >
            Get Started
          </motion.button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Features
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "📝",
              title: "Mood Journaling",
              description:
                "Log your daily moods and track your emotional journey.",
            },
            {
              icon: "🤖",
              title: "AI Sentiment Analysis",
              description:
                "Get insights into your mood with AI-powered analysis.",
            },
            {
              icon: "📊",
              title: "Progress Dashboard",
              description: "Visualize your mood trends and progress over time.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>
        <div className="max-w-4xl mx-auto">
          {[
            {
              quote:
                "Mindful Moments has helped me understand my emotions better. Highly recommend!",
              author: "Jane Doe",
            },
            {
              quote:
                "The AI sentiment analysis is spot on. It feels like having a personal therapist.",
              author: "John Smith",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-xl italic mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold">- {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all">
            Sign Up Now
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>© 2025 Mindful Moments. All rights reserved.</p>
      </footer>
    </div>
  );
}
