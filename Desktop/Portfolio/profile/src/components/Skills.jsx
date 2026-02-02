import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTheme } from "../ThemeContext";
import { Code2, Users } from "lucide-react";

const technicalSkills = [
  {
    title: "Data Analytics & Visualization",
    items: ["Python", "Pandas", "NumPy", "Power BI", "DAX", "Excel", "Tableau"],
  },
  {
    title: "Machine Learning & Statistics",
    items: ["Scikit-Learn", "EDA", "Statistics", "Regression", "Clustering"],
  },
  {
    title: "Programming & Databases",
    items: ["SQL", "MySQL", "MongoDB", "JavaScript", "C++", "Java"],
  },
  {
    title: "Tools & Platforms",
    items: ["Git", "GitHub", "Flask", "Jupyter Notebook", "Figma"],
  },
];

const softSkills = [
  {
    title: "Communication & Collaboration",
    items: ["Communication", "Teamwork", "Presentation Skills", "Stakeholder Management"],
  },
  {
    title: "Problem Solving & Leadership",
    items: ["Problem Solving", "Critical Thinking", "Leadership", "Strategic Planning"],
  },
  {
    title: "Professional Development",
    items: ["Time Management", "Adaptability", "Continuous Learning", "Project Management"],
  },
];

export default function Skills() {
  const [query, setQuery] = useState("");
  const { theme } = useTheme();
  
  const filteredTechnical = useMemo(() => {
    if (!query.trim()) return technicalSkills;
    const q = query.toLowerCase();
    return technicalSkills
      .map(g => ({
        title: g.title,
        items: g.items.filter(i => i.toLowerCase().includes(q))
      }))
      .filter(g => g.items.length > 0);
  }, [query]);

  const filteredSoft = useMemo(() => {
    if (!query.trim()) return softSkills;
    const q = query.toLowerCase();
    return softSkills
      .map(g => ({
        title: g.title,
        items: g.items.filter(i => i.toLowerCase().includes(q))
      }))
      .filter(g => g.items.length > 0);
  }, [query]);
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <motion.p 
          className={`text-sm uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Expertise
        </motion.p>
        <div className="relative inline-block">
          <motion.h2 
            className={`mt-2 text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Skills & Expertise
          </motion.h2>
        </div>
      </motion.div>

      {/* Filter/Search */}
      <div className="mb-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills…"
          className={`w-full md:w-1/2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 border transition ${theme==='dark' ? 'border-white/20 bg-white/5 text-slate-200 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'}`}
        />
      </div>

      {/* Technical Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-14"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg bg-indigo-500/10 p-3">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Technical Skills</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Tools, technologies & programming expertise</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredTechnical.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ 
                scale: 1.03, 
                rotateX: 3,
                boxShadow: "0 25px 50px rgba(79, 70, 229, 0.3)"
              }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`group relative rounded-2xl border backdrop-blur-xl p-6 hover:border-indigo-300/50 overflow-hidden ${theme==='dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80' : 'border-black/10 bg-gradient-to-br from-slate-50 to-white'}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(120deg, rgba(79,70,229,0.2), rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1 }}
              />
              <motion.h4 
                className="relative z-10 mb-4 text-lg font-semibold text-indigo-300 inline-block"
                whileHover={{ x: 6 }}
              >
                {group.title}
              </motion.h4>

              <motion.div
                className="h-1 w-full bg-gradient-to-r from-indigo-600 to-purple-600 origin-left mt-2 mb-6 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
              />

              <div className="relative z-10 flex flex-wrap gap-3">
                {group.items.map((skill, skillIdx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.6, rotateZ: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -4,
                      rotateZ: 5,
                      boxShadow: "0 10px 20px rgba(79, 70, 229, 0.4)"
                    }}
                    transition={{ 
                      delay: skillIdx * 0.05, 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    className={`relative rounded-full border backdrop-blur-sm px-4 py-1.5 text-sm font-medium transition hover:border-indigo-400 cursor-default overflow-hidden group/badge ${theme==='dark' ? 'border-white/20 bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-slate-200 hover:text-white' : 'border-slate-300 bg-gradient-to-r from-white to-slate-100 text-slate-800 hover:text-slate-900'}`}
                  >
                    {/* Shimmer effect on hover */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">{skill}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Soft Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg bg-purple-500/10 p-3">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Soft Skills</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Professional & interpersonal abilities</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSoft.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ 
                scale: 1.03, 
                rotateX: 3,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.2)"
              }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`group relative rounded-2xl border backdrop-blur-xl p-6 hover:border-purple-300/50 overflow-hidden ${theme==='dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80' : 'border-black/10 bg-gradient-to-br from-slate-50 to-white'}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(120deg, rgba(168,85,247,0.2), rgba(168,85,247,0.15), rgba(139,92,246,0.2))',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1 }}
              />
              <motion.h4 
                className="relative z-10 mb-4 text-lg font-semibold text-purple-300 inline-block"
                whileHover={{ x: 6 }}
              >
                {group.title}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                />
              </motion.h4>

              <div className="relative z-10 flex flex-wrap gap-3">
                {group.items.map((skill, skillIdx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.6, rotateZ: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -4,
                      rotateZ: 5,
                      boxShadow: "0 10px 20px rgba(168, 85, 247, 0.4)"
                    }}
                    transition={{ 
                      delay: skillIdx * 0.05, 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    className={`relative rounded-full border backdrop-blur-sm px-4 py-1.5 text-sm font-medium transition hover:border-purple-400 cursor-default overflow-hidden group/badge ${theme==='dark' ? 'border-white/20 bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-slate-200 hover:text-white' : 'border-slate-300 bg-gradient-to-r from-white to-slate-100 text-slate-800 hover:text-slate-900'}`}
                  >
                    {/* Shimmer effect on hover */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">{skill}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
