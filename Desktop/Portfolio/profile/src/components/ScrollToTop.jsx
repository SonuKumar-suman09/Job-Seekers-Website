import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", updateVisibility);
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        scale: visible ? 1 : 0,
        y: visible ? 0 : 100
      }}
      whileHover={{ scale: 1.1, rotate: 360 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white shadow-lg shadow-indigo-500/50 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/70"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
      
      {/* Circular progress indicator */}
      <svg 
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
          fill="none"
          style={{
            pathLength: scrollYProgress
          }}
        />
      </svg>
    </motion.button>
  );
}
