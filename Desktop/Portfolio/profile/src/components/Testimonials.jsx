import { motion } from "framer-motion";
import { useTheme } from "../ThemeContext";

const testimonials = [
  { name: "Prof. Rajesh Kumar", role: "Faculty Mentor", text: "Sonu demonstrates exceptional analytical thinking and attention to detail. His ability to transform complex data into actionable insights is remarkable." },
  { name: "Amit Singh", role: "Project Collaborator", text: "Working with Sonu on data analytics projects has been seamless. He delivers clean code, clear documentation, and insightful analysis every time." },
  { name: "Priya Sharma", role: "Industry Professional", text: "Impressed by Sonu's proficiency with Power BI and SQL. He built a comprehensive dashboard that directly impacted our business decisions positively." },
  { name: "Vikram Patel", role: "University Peer", text: "Sonu's passion for data science is contagious. He's always eager to learn, mentor others, and contribute meaningfully to team projects." },
];

export default function Testimonials() {
  const { theme } = useTheme();
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <p className={`text-sm uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>Kind words</p>
        <h2 className={`mt-2 text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Testimonials</h2>
      </motion.div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {testimonials.map((t, idx) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`rounded-xl border p-6 ${theme==='dark' ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
            <div className="flex items-start gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className={`${theme==='dark' ? 'text-slate-300' : 'text-slate-700'}`}>"{t.text}"</p>
            <div className="mt-4 flex items-center justify-between">
              <div className={`text-sm font-semibold ${theme==='dark' ? 'text-white' : 'text-slate-900'}`}>{t.name}</div>
              <div className={`text-xs ${theme==='dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
