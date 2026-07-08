import { testimonialsData } from "../data";
import { Star, MessageSquareQuote } from "lucide-react";
import { motion } from "motion/react";

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonialsData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="shadow-neu-flat rounded-3xl p-6 relative flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01] transition-all duration-300 group bg-[#e2e8f0]"
        >
          {/* Quote design background decorative asset */}
          <div className="absolute top-4 right-4 text-slate-300 pointer-events-none opacity-30">
            <MessageSquareQuote className="w-16 h-16" />
          </div>

          <div>
            {/* Stars rating panel */}
            <div className="flex gap-1 mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>

            {/* Quote content */}
            <p className="text-slate-600 text-sm leading-relaxed italic mb-6 relative z-10">
              "{item.text}"
            </p>
          </div>

          {/* User profile layout */}
          <div className="flex items-center gap-3.5 pt-4 border-t border-slate-300">
            {/* Custom initials avatar placeholder when photoUrl is absent */}
            <div className="w-10 h-10 rounded-full bg-[#e2e8f0] shadow-neu-inset border-0 flex items-center justify-center font-black text-sm text-[#7b6cff] select-none">
              {item.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
            </div>

            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#7b6cff] transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500">
                {item.role}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
