import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import { ExternalLink, Github } from "lucide-react";

function AnimatedCounter({ value, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value);

  useEffect(() => {
    if (isInView && !isNaN(numericValue)) {
      let start = 0;
      const duration = 1500;
      const increment = numericValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);
  const { theme } = useTheme();
  const suffix = !isNaN(numericValue) ? value.replace(numericValue.toString(), "") : "";
  const cardClass = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 hover:border-indigo-400/50'
    : 'bg-gradient-to-br from-slate-50 to-white border-black/10 hover:border-indigo-400/50';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)"
      }}
      transition={{ delay, duration: 0.4 }}
      className={`group relative rounded-2xl ${cardClass} p-6 text-center border backdrop-blur-sm cursor-default overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
      <div className="relative z-10">
        <motion.p 
          className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {!isNaN(numericValue) ? count + suffix : value}
        </motion.p>
        <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{label}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const { theme } = useTheme();
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl px-6 py-20 text-center md:text-left"
    >
      {/* Heading */}
      <motion.div className="relative inline-block">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
        >
          About Me
        </motion.h2>
        <motion.div
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </motion.div>

      {/* Paragraph 1 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`mt-6 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
      >
        I’m a Computer Science Engineering undergraduate at Lovely Professional
        University with a strong focus on{" "}
        <span className="text-indigo-400 font-medium">
          Data Analytics, Data Science, and Machine Learning
        </span>
        . I enjoy transforming raw data into meaningful insights that help teams
        make informed, data-driven decisions.
      </motion.p>

      {/* Paragraph 2 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-4 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
      >
        I have hands-on experience with{" "}
        <span className="text-indigo-400 font-medium">
          Python, SQL, Power BI, Excel, Pandas, NumPy, and Scikit-Learn
        </span>{" "}
        through real-world projects involving exploratory data analysis,
        interactive dashboards, and analytical applications. I focus on writing
        clean, maintainable code and building solutions that are both accurate
        and practical.
      </motion.p>

      {/* Paragraph 3 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-4 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
      >
        I am actively seeking{" "}
        <span className="text-indigo-400 font-medium">
          internship or entry-level roles
        </span>{" "}
        where I can contribute to analytics-driven teams, continue learning from
        industry professionals, and grow as a{" "}
        <span className="text-indigo-400 font-medium">
          Data Analyst or Data Scientist
        </span>
        .
      </motion.p>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: "10+", label: "Projects", delay: 0.4 },
          { value: "5+", label: "Certifications", delay: 0.5 },
          { value: "3★", label: "HackerRank", delay: 0.6 },
          { value: "2027", label: "Grad Year", delay: 0.7 },
        ].map((stat) => (
          <AnimatedCounter
            key={stat.label}
            value={stat.value}
            label={stat.label}
            delay={stat.delay}
          />
        ))}
      </div>

      {/* Data Science Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: "📊",
            title: "Analytics Approach",
            desc: "Transform raw data into strategic insights using EDA, statistical analysis, and compelling visualizations that drive business decisions."
          },
          {
            icon: "🤖",
            title: "ML & AI Focus",
            desc: "Build predictive models with scikit-learn, from classification to regression, with rigorous validation and hyperparameter tuning."
          },
          {
            icon: "💡",
            title: "Data-Driven Impact",
            desc: "Create interactive dashboards in Power BI with DAX calculations, enabling stakeholders to explore KPIs and trends in real-time."
          },
        ].map((insight, idx) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + idx * 0.1 }}
            className={`p-6 rounded-xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className="text-4xl mb-3">{insight.icon}</div>
            <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{insight.title}</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{insight.desc}</p>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
