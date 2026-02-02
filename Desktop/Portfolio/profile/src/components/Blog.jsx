import { motion } from "framer-motion";
import { useTheme } from "../ThemeContext";

const blogPosts = [
  {
    id: 1,
    title: "Mastering EDA: From Raw Data to Insights",
    date: "Dec 2025",
    category: "Analytics",
    excerpt: "A deep dive into exploratory data analysis techniques using Python, Pandas, and visualization libraries to uncover patterns and anomalies in datasets.",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Building Interactive Dashboards with Power BI",
    date: "Nov 2025",
    category: "BI",
    excerpt: "Learn how to create compelling Power BI dashboards with DAX calculations, slicers, and drill-through reports for executive decision-making.",
    readTime: "10 min read"
  },
  {
    id: 3,
    title: "Introduction to Machine Learning with Scikit-Learn",
    date: "Oct 2025",
    category: "ML",
    excerpt: "Practical guide to building classification and regression models, hyperparameter tuning, and model evaluation using Scikit-Learn.",
    readTime: "12 min read"
  },
  {
    id: 4,
    title: "SQL for Data Analysis: Best Practices",
    date: "Sep 2025",
    category: "Databases",
    excerpt: "Essential SQL techniques for efficient data querying, aggregation, and optimization when working with large datasets.",
    readTime: "7 min read"
  },
];

export default function Blog() {
  const { theme } = useTheme();
  return (
    <section id="blog" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">Insights</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">Blog</h2>
        <p className="mt-4 text-slate-500">Articles on data analytics, business intelligence, and machine learning.</p>
      </motion.div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {blogPosts.map((post, idx) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`rounded-xl border p-6 ${theme==='dark' ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-indigo-400">{post.category}</span>
              <span className="text-xs text-slate-500">{post.date}</span>
            </div>
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${theme==='dark' ? 'text-slate-400' : 'text-slate-600'}`}>{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">{post.readTime}</span>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Read more →</a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
