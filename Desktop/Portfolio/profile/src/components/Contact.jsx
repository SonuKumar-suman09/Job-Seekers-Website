import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../ThemeContext";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState({ loading: false, ok: null, message: "" });
  const { theme } = useTheme();

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      setStatus({ loading: true, ok: null, message: "" });
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      setStatus({ loading: false, ok: res.ok, message: data?.message || (res.ok ? "Message sent" : "Failed to send") });
      if (res.ok) e.currentTarget.reset();
    } catch (err) {
      setStatus({ loading: false, ok: false, message: "Network error" });
    }
  }
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      {/* Small label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`text-sm uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}
      >
        Get in touch
      </motion.p>

      {/* Heading */}
      <motion.div className="relative inline-block">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mt-2 text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
        >
          Contact
        </motion.h2>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-4 max-w-2xl leading-relaxed text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
      >
        <span className="text-indigo-400 font-semibold">Open to full-time positions and internships</span> in 
        Data Analytics, Business Intelligence, and Data Science roles. 
        <br />
        <br />
        If you're a recruiter or hiring manager looking for a detail-oriented analyst who can turn data into 
        actionable insights, let's connect. I'm ready to contribute to your team's success.
      </motion.p>

      {/* Direct contact */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
          className={`rounded-xl border p-6 flex items-start gap-4 transition-all ${theme === 'dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80' : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white'}`}
        >
          <div className="rounded-lg bg-indigo-500/10 p-3">
            <MapPin className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-300 mb-1">Location</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Punjab, India</p>
          </div>
        </motion.div>

        {/* Email Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
          className={`rounded-xl border p-6 flex items-start gap-4 transition-all ${theme === 'dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80' : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white'}`}
        >
          <div className="rounded-lg bg-indigo-500/10 p-3">
            <Mail className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-300 mb-1">Email</h3>
            <a
              href="mailto:sonukumarsuman82@gmail.com"
              className={`text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-indigo-300' : 'text-slate-600 hover:text-indigo-600'} transition`}
            >
              sonukumarsuman82@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Phone Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
          className={`rounded-xl border p-6 flex items-start gap-4 transition-all ${theme === 'dark' ? 'border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80' : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white'}`}
        >
          <div className="rounded-lg bg-indigo-500/10 p-3">
            <Phone className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-300 mb-1">Phone</h3>
            <a
              href="tel:+918340546905"
              className={`text-sm font-semibold ${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-500'} transition`}
            >
              +91 8340546905
            </a>
          </div>
        </motion.div>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-10"
      >
        <h3 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Connect with me</h3>
        <div className="flex items-center gap-3">
          {[
            { icon: Linkedin, href: "#", label: "LinkedIn", color: "text-blue-400" },
            { icon: Github, href: "#", label: "GitHub", color: "text-slate-400" },
            { icon: Twitter, href: "#", label: "Twitter", color: "text-cyan-400" },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-lg border p-3 transition-all ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
              title={social.label}
            >
              <social.icon className={`w-5 h-5 ${social.color}`} />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      >
          <input name="name" required placeholder="Your name" className={`w-full rounded-md px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme==='dark' ? 'border-white/20 bg-white/5 text-slate-200 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'}`} />
          <input name="email" type="email" required placeholder="Email" className={`w-full rounded-md px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme==='dark' ? 'border-white/20 bg-white/5 text-slate-200 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'}`} />
          <input name="subject" placeholder="Subject" className={`w-full md:col-span-2 rounded-md px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme==='dark' ? 'border-white/20 bg-white/5 text-slate-200 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'}`} />
          <textarea name="message" required rows={5} placeholder="Message" className={`w-full md:col-span-2 rounded-md px-4 py-3 border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme==='dark' ? 'border-white/20 bg-white/5 text-slate-200 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'}`} />
        <button 
          disabled={status.loading} 
            className={`w-full md:col-span-2 rounded-md px-6 py-3 font-semibold transition-all duration-300 ${
            status.loading 
              ? 'bg-indigo-400 cursor-wait' 
              : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50'
          } text-white disabled:opacity-70`}
        >
          {status.loading ? "Sending…" : "Send Message"}
        </button>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:col-span-2 p-3 rounded-md text-sm font-medium ${
              status.ok 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {status.message}
          </motion.div>
        )}
      </motion.form>
    </section>
  );
}
