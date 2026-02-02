import { useTheme } from "../ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer 
      className={`border-t ${theme === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'} pt-6 pb-4`}
    >
      <div className={`mx-auto max-w-6xl px-6 flex flex-col items-center gap-3 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        {/* Availability / Role */}
        <div className="text-base">
          <span className="text-indigo-400 font-semibold text-base sm:text-lg">
            Available for Immediate Hire
          </span>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
            <span>Data Analyst</span>
            <span className="text-indigo-400">•</span>
            <span>Business Intelligence</span>
            <span className="text-indigo-400">•</span>
            <span>Data Science</span>
          </div>
        </div>

        {/* Social Links with Icons */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            { 
              href: "mailto:Sonukumarsuman82@gmail.com", 
              label: "Email",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              )
            },
            { 
              href: "https://github.com/SonuKumar-suman09", 
              label: "GitHub", 
              target: "_blank",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )
            },
            { 
              href: "https://www.linkedin.com/in/sonukumarsuman09/", 
              label: "LinkedIn", 
              target: "_blank",
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              )
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.target}
              rel={link.target ? "noreferrer" : undefined}
              className={`flex flex-col items-center gap-2 group ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-indigo-600'} transition-all duration-300 hover:-translate-y-1`}
              title={link.label}
            >
              <div
                className={`p-3 rounded-full ${theme === 'dark' ? 'bg-white/5 group-hover:bg-indigo-500/20' : 'bg-slate-100 group-hover:bg-indigo-100'} transition-all duration-300`}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium">{link.label}</span>
            </a>
          ))}
        </div>

        {/* Name */}
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
          Sonu Kumar Suman
        </p>
      </div>
    </footer>
  );
}
