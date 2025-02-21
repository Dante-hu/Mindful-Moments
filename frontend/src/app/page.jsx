// app/page.jsx
"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function Home() {
  // Animation controls
  const controls = useAnimation();
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1 });

  const features = [
    {
      icon: "📝",
      title: "Mood Journaling",
      description: "Log your daily moods and track your emotional journey.",
    },
    {
      icon: "🤖",
      title: "AI Sentiment Analysis",
      description: "Get insights into your mood with AI-powered analysis.",
    },
    {
      icon: "📊",
      title: "Progress Dashboard",
      description: "Visualize your mood trends and progress over time.",
    },
  ];

  const testimonials = [
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
  ];

  // Animation triggers
  useEffect(() => {
    if (featuresInView || testimonialsInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [controls, featuresInView, testimonialsInView]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          Mindful Moments
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-base md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Your personal mood journal and stress management companion. Start
          tracking your emotional well-being in just 2 minutes a day.
        </motion.p>
        <Link href="/register" className="group">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started Free
          </motion.button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" ref={featuresRef}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? "visible" : "hidden"}
          className="text-4xl font-bold text-center mb-12"
        >
          Why Choose Mindful Moments?
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-6xl mb-4 hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        ref={testimonialsRef}
      >
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={testimonialsInView ? "visible" : "hidden"}
          className="text-4xl font-bold text-center mb-12"
        >
          Trusted by Thousands
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
            >
              <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold">{testimonial.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/*
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8">
            Ready to Transform Your Emotional Well-being?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of users already improving their mental health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all transform hover:scale-105">
                Start Free Trial
              </button>
            </Link>
            <Link href="/demo">
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all">
                Watch Demo
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
      */}

      {/* Footer */}
      {/*
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mindful Moments</h3>
              <p className="text-gray-400">
                Empowering emotional wellness since {new Date().getFullYear()}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Mindful Moments. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      */}
    </div>
  );
}
