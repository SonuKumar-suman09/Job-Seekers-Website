import { motion } from "framer-motion";
import { useTheme } from "../ThemeContext";

export default function ProjectCard({
  title,
  description,
  tech = [],
  githubLink,
  demoLink,
}) {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        rotateX: 5,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between gap-5 rounded-2xl border backdrop-blur-xl p-6 shadow-2xl hover:border-indigo-400/50 overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 hover:shadow-indigo-500/30' : 'border-slate-200 bg-white shadow-sm hover:shadow-lg'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, rgba(79,70,229,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />
      {/* Content */}
      <div className="relative z-10">
        <motion.h3 
          className={`text-xl font-semibold transition-colors ${theme === 'dark' ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'}`}
          whileHover={{ x: 4 }}
        >
          {title}
        </motion.h3>

        <p className={`mt-2 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>

        {/* Tech Stack */}
        {tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tech.map((item, idx) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm cursor-default ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/30 text-indigo-300 hover:border-indigo-400/60' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}
              >
                {item}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-10 flex flex-wrap gap-3 text-sm font-semibold">
        {githubLink && (
          <motion.a
            href={githubLink}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative rounded-full border border-white/20 px-4 py-2 text-slate-200 transition hover:border-indigo-300 hover:text-white hover:bg-white/10 backdrop-blur-sm overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">View Code</span>
          </motion.a>
        )}

        {demoLink && (
          <motion.a
            href={demoLink}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-white transition hover:from-indigo-400 hover:to-purple-400 hover:shadow-lg hover:shadow-indigo-500/50 overflow-hidden group/btn"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Live Demo</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
