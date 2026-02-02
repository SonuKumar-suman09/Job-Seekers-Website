import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeContext";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      navItems.forEach(item => {
        const section = document.querySelector(item.href);
        if (section) {
          const top = section.offsetTop - 120;
          const height = section.offsetHeight;
          if (window.scrollY >= top && window.scrollY < top + height) {
            setActive(item.href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? (theme === 'dark' ? 'border-white/20 bg-slate-950/90 shadow-lg shadow-indigo-500/10' : 'border-black/10 bg-white/90 shadow-lg') 
          : (theme === 'dark' ? 'border-white/10 bg-slate-950/70' : 'border-black/10 bg-white/70')
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <motion.a
          href="#home"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`text-lg font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} relative group`}
        >
          Sonu<span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>.</span>
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

          {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${theme==='dark' ? 'text-slate-200' : 'text-slate-700'}`}>
          {navItems.map((item, idx) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -2 }}
              className={`relative transition hover:text-indigo-300 ${
                active === item.href ? "text-indigo-400" : ""
              }`}
            >
              {item.label}

              {/* Active underline */}
              {active === item.href && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                />
              )}
            </motion.a>
          ))}
        </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border transition ${theme === 'dark' ? 'border-white/20 hover:border-indigo-300' : 'border-slate-300 hover:border-indigo-500'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((o) => !o)}
              className={`md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border transition ${theme === 'dark' ? 'border-white/20 hover:border-indigo-300' : 'border-slate-300 hover:border-indigo-500'}`}
            >
              <span>{open ? "✕" : "☰"}</span>
            </button>
          </div>

        {/* Mobile dropdown */}
        {open && (
          <div className={`absolute left-0 right-0 top-full md:hidden backdrop-blur-md border-t px-6 py-4 ${theme==='dark' ? 'bg-black/80 border-white/10' : 'bg-white/90 border-black/10'}`}>
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm ${active === item.href ? 'text-indigo-500' : (theme==='dark' ? 'text-slate-200' : 'text-slate-700')}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
