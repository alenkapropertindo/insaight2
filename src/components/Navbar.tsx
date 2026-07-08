import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Cpu, User, Home, Shield } from "lucide-react";

interface NavbarProps {
  onJoinClick: () => void;
  onMemberClick: () => void;
  isMemberActive: boolean;
  isAdminActive: boolean;
  onHomeClick: () => void;
}

export default function Navbar({ 
  onJoinClick, 
  onMemberClick, 
  isMemberActive,
  isAdminActive,
  onHomeClick
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAnyPortalActive = isMemberActive || isAdminActive;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#e2e8f0]/85 border-b border-[#ffffff]/50 shadow-neu-flat-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onHomeClick}
              className="p-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat-sm text-[#7b6cff] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Cpu className="w-5 h-5 animate-pulse" />
            </button>
            <button onClick={onHomeClick} className="text-xl font-extrabold tracking-tight text-slate-800 select-none text-left">
              insAIght<span className="text-[#00d4ff]">_Kendari</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {isAnyPortalActive ? (
              <button 
                onClick={onHomeClick} 
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-neu-flat-sm hover:shadow-neu-inset-sm"
              >
                <Home className="w-3.5 h-3.5 text-[#7b6cff]" />
                <span>Beranda Utama</span>
              </button>
            ) : (
              <div className="flex items-center gap-5 bg-[#e2e8f0] px-4 py-1.5 rounded-full shadow-neu-inset-sm border border-white/20">
                <a href="#apa-yang-didapat" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  Benefit
                </a>
                <a href="#workshop" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  Playground Prompt
                </a>
                <a href="#testimonials" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  Komunitas
                </a>
                <a href="#faq" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  FAQ
                </a>
              </div>
            )}

            {/* Unified Area Member Button */}
            <button
              onClick={onMemberClick}
              className={`text-xs font-bold transition-all px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 ${
                isAnyPortalActive
                  ? "shadow-neu-inset-sm text-[#00d4ff] bg-[#e2e8f0]"
                  : "shadow-neu-flat-sm text-slate-600 hover:text-slate-900 hover:shadow-neu-inset-sm bg-[#e2e8f0]"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>{isAnyPortalActive ? "Portal Member" : "Area Member"}</span>
            </button>
          </div>

          <div className="hidden md:block">
            <button
              onClick={isAnyPortalActive ? onHomeClick : onJoinClick}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7b6cff] to-[#00d4ff] text-white text-xs font-bold tracking-wide transition-all shadow-neu-primary hover:opacity-95 active:scale-95"
            >
              {isAnyPortalActive ? "Kembali ke Beranda" : "Gabung Sekarang"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat-sm text-slate-600 hover:text-slate-900 hover:shadow-neu-inset-sm focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#e2e8f0] border-b border-[#ffffff]/50 shadow-neu-flat"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {isAnyPortalActive ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onHomeClick();
                  }}
                  className="w-full text-left block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-[#7b6cff]" />
                  <span>Beranda Utama</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <a
                    href="#apa-yang-didapat"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all"
                  >
                    Benefit
                  </a>
                  <a
                    href="#workshop"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all"
                  >
                    Playground Prompt
                  </a>
                  <a
                    href="#testimonials"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all"
                  >
                    Komunitas
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all"
                  >
                    FAQ
                  </a>
                </div>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onMemberClick();
                }}
                className="w-full text-left block px-3 py-2.5 rounded-xl text-sm font-bold text-[#00d4ff] bg-[#e2e8f0] shadow-neu-flat-sm hover:shadow-neu-inset-sm transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{isAnyPortalActive ? "Portal Member" : "Area Member"}</span>
              </button>

              <div className="pt-4 border-t border-slate-300">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (isAnyPortalActive) {
                      onHomeClick();
                    } else {
                      onJoinClick();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7b6cff] to-[#00d4ff] text-white text-center font-bold shadow-neu-primary hover:opacity-95"
                >
                  {isAnyPortalActive ? "Kembali ke Beranda" : "Gabung Sekarang"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
