
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-6 lg:p-8">
      <div className="bg-black text-white rounded-xlarge p-10 lg:p-20 flex flex-col min-h-[500px] justify-between relative overflow-hidden group">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-display font-semibold leading-tight max-w-3xl mb-4">
            The car that will save your time and money is just a few clicks away.
          </h2>
          <p className="text-slate-400 text-lg mb-10">Ready to get started?</p>

          <div className="flex flex-wrap gap-4 mb-20">
            <a href="?contact=true" className="inline-block text-center bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5">
              Get a quote
            </a>
            <a href="?contact=true" className="inline-block text-center bg-[#2a2a2a] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#333333] transition-all hover:-translate-y-1 active:scale-95">
              Book a consultation
            </a>
          </div>
        </div>

        <div className="mt-auto space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <a
              className="text-slate-300 text-lg hover:text-white transition-colors flex items-center gap-2 group/link"
              href="mailto:hi@nextcar.com"
            >
              hi@nextcar.com
              <span className="material-symbols-outlined text-sm opacity-0 group-hover/link:opacity-100 transition-opacity">north_east</span>
            </a>

            <div className="flex gap-8 text-white font-medium uppercase text-xs tracking-widest">
              <a className="hover:text-slate-400 transition-colors" href="#">x</a>
              <a className="hover:text-slate-400 transition-colors" href="#">behance</a>
              <a className="hover:text-slate-400 transition-colors" href="#">linkedin</a>
              <a className="hover:text-slate-400 transition-colors" href="#">dribbble</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <p>© 2024 Nextcar. All rights reserved</p>
            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
