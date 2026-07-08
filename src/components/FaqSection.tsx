import { useState } from "react";
import { faqsData } from "../data";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FaqSection() {
  const [activeId, setActiveId] = useState<string | null>(faqsData[0].id);

  const toggleFaq = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqsData.map((item, index) => {
        const isOpen = activeId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-2xl transition-all overflow-hidden bg-[#e2e8f0] ${
              isOpen
                ? "shadow-neu-inset"
                : "shadow-neu-flat"
            }`}
          >
            {/* Header toggle button */}
            <button
              onClick={() => toggleFaq(item.id)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3.5 pr-4">
                <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                  isOpen ? "text-[#7b6cff]" : "text-slate-400"
                }`} />
                <span className="text-slate-800 font-semibold text-sm sm:text-base pr-2">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#7b6cff]" : ""
                }`}
              />
            </button>

            {/* Answer panel (collapsible) */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-4 border-t border-slate-300/60 text-slate-600 text-sm leading-relaxed pl-[42px] sm:pl-[49px]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
