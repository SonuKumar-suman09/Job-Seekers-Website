import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../ThemeContext";

export default function Hero() {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const floatY1 = useTransform(scrollY, [0, 500], [0, -40]);
  const floatY2 = useTransform(scrollY, [0, 500], [0, 40]);
  return (
    <section
      id="home"
      className="mx-auto flex min-h-[85vh] max-w-6xl flex-col md:flex-row items-center justify-between gap-12 px-6 pb-24 pt-32 relative overflow-hidden"
    >
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"
        style={{ y: floatY1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
        style={{ y: floatY2 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Left Content */}
      <div className="flex-1 flex flex-col gap-6 text-center md:text-left relative z-10">
        {/* Role Tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -5, 0]
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`text-sm uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}
        >
          Data Analyst • Data Science & ML Enthusiast
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <motion.span 
            className={`bg-gradient-to-r bg-clip-text text-transparent ${theme === 'dark' ? 'from-white via-slate-100 to-slate-300' : 'from-slate-900 via-slate-800 to-slate-700'}`}
          >
            Sonu Kumar Suman
          </motion.span>
        </motion.h1>

        {/* Role Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <p className={`text-xl md:text-2xl font-semibold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Data Analyst | Data Science & ML Enthusiast
        </p>
      </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`max-w-2xl text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Transforming complex datasets into actionable business insights through advanced analytics, 
          interactive dashboards, and machine learning. Experienced in Python, SQL, Power BI, and 
          statistical modeling to drive data-driven decision making.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <motion.a
            href="mailto:Sonukumarsuman82@gmail.com"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/50 relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Contact Me</span>
          </motion.a>

          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full border px-6 py-3 text-sm font-semibold relative overflow-hidden group transition ${theme === 'dark' ? 'border-indigo-300 text-indigo-200 hover:border-indigo-200 hover:text-white hover:bg-white/5' : 'border-indigo-500 text-indigo-700 hover:border-indigo-600 hover:text-white hover:bg-indigo-600'}`}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">View Projects</span>
          </motion.a>

          <motion.a
            href="/resume.docx"
            download
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full border px-6 py-3 text-sm font-semibold relative overflow-hidden group transition ${theme === 'dark' ? 'border-purple-300 text-purple-200 hover:border-purple-200 hover:text-white hover:bg-white/5' : 'border-purple-500 text-purple-700 hover:border-purple-600 hover:text-white hover:bg-purple-600'}`}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Download Resume</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Right - Profile Picture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10"
      >
        <div className="relative">
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-indigo-400 shadow-2xl shadow-indigo-500/50 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <img 
              src="/profile.png" 
              alt="Sonu Kumar" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Decorative rings */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-indigo-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-8 rounded-full border-2 border-purple-400/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
