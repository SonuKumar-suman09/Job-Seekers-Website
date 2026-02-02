import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useTheme } from "./ThemeContext";

// Featured projects to display
const FEATURED_REPOS = [
  "DSA-Calculator",
  "Customer-Intelligence-Revenue-Optimization-System",
  "Road-Accident-Analysis-Dashboard",
  "Predictive-Analytics-Project-Diabetes-Prediction-using-Python",
  "ai-travel",
  "e-learning-platform-",
];

// Project descriptions mapping
const PROJECT_DESCRIPTIONS = {
  "DSA-Calculator": {
    title: "DSA Calculator - Expression Evaluator",
    description: "Advanced calculator implementing stack-based expression evaluation with real-time step-by-step visualizations. Demonstrates algorithmic thinking and clean code architecture.",
    tech: ["JavaScript", "React", "Data Structures", "Algorithms"],
    demoLink: "https://dsacalculator.vercel.app",
  },
  "Customer-Intelligence-Revenue-Optimization-System": {
    title: "Customer Intelligence Revenue Optimization",
    description: "Industry-oriented Data Science project showcasing customer segmentation, revenue prediction, and churn analysis using advanced machine learning techniques.",
    tech: ["Python", "Scikit-Learn", "Machine Learning", "Data Analysis"],
    demoLink: "#",
  },
  "Road-Accident-Analysis-Dashboard": {
    title: "Road Accident Analysis Dashboard",
    description: "Power BI dashboard transforming raw accident data into interactive dashboards. Identifies accident patterns, high-risk areas, severity levels, and key factors for road safety.",
    tech: ["Power BI", "Data Visualization", "Analytics", "DAX"],
    demoLink: "#",
  },
  "Predictive-Analytics-Project-Diabetes-Prediction-using-Python": {
    title: "Diabetes Prediction System",
    description: "Predictive analytics project using Pima Indians dataset. Implements multiple ML models including Logistic Regression, KNN, Decision Tree, and Naive Bayes with comprehensive evaluation metrics.",
    tech: ["Python", "Scikit-Learn", "Machine Learning", "Data Preprocessing"],
    demoLink: "#",
  },
  "ai-travel": {
    title: "AI Travel Booking Platform",
    description: "Intelligent travel planning web application with flight search, booking management, and AI-powered recommendations for travel itineraries.",
    tech: ["HTML", "JavaScript", "React", "API Integration"],
    demoLink: "https://ai-travel-blue.vercel.app",
  },
  "e-learning-platform-": {
    title: "E-Learning Platform",
    description: "Full-featured online learning platform with course management, interactive lessons, progress tracking, and user authentication.",
    tech: ["JavaScript", "React", "Node.js", "Database"],
    demoLink: "#",
  },
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Use timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(
          "https://api.github.com/users/SonuKumar-suman09/repos?per_page=50",
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const repos = await response.json();
        
        // Filter and map featured repos
        const filteredProjects = repos
          .filter(repo => FEATURED_REPOS.includes(repo.name))
          .map(repo => {
            const customData = PROJECT_DESCRIPTIONS[repo.name] || {};
            return {
              title: customData.title || repo.name.replace(/-/g, " "),
              description: customData.description || repo.description || "Check out this project on GitHub",
              tech: customData.tech || [repo.language || "Project"].filter(Boolean),
              githubLink: repo.html_url,
              demoLink: customData.demoLink || repo.homepage || "#",
            };
          });
        
        // Sort by featured repos order
        const sortedProjects = FEATURED_REPOS
          .map(name => filteredProjects.find(p => p.githubLink.includes(name)))
          .filter(Boolean);
        
        setProjects(sortedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        // Set fallback projects if API fails
        const fallbackProjects = FEATURED_REPOS.map(name => {
          const customData = PROJECT_DESCRIPTIONS[name] || {};
          return {
            title: customData.title || name.replace(/-/g, " "),
            description: customData.description || "GitHub Project",
            tech: customData.tech || ["Project"],
            githubLink: `https://github.com/SonuKumar-suman09/${name}`,
            demoLink: customData.demoLink || "#",
          };
        });
        setProjects(fallbackProjects);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const { theme } = useTheme();
  const containerClass = theme === "dark"
    ? "relative bg-slate-950 text-slate-100"
    : "relative bg-white text-slate-900";

  return (
    <main className={containerClass}>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Abstract Data Network Visualization */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Flowing data lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          {/* Data connection lines */}
          <motion.path
            d="M 0 200 Q 200 100 400 200 T 800 200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 100 400 Q 300 300 500 400 T 900 400"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <motion.path
            d="M 1400 300 Q 1200 200 1000 300 T 600 300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.25 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
          />
        </svg>
        
        {/* Data nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
      </div>
      
      {/* Animated Background Layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.15),transparent_35%)]" 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.15),transparent_30%)]" 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(139,92,246,0.1),transparent_40%)]" 
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Sections */}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} />
      <Contact />
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />

    </main>
  );
}
