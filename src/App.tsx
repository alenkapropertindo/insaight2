import { useState, ComponentType, useEffect } from "react";
import { 
  Tv, 
  Zap, 
  Video, 
  DollarSign, 
  TrendingUp, 
  Users2, 
  CheckSquare, 
  Flame, 
  Lightbulb, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Cpu, 
  Group, 
  Star,
  Users,
  GraduationCap,
  ShoppingBag
} from "lucide-react";
import { motion } from "motion/react";

import { featuresData, benefitsData, useCasesData, targetAudienceData } from "./data";
import Navbar from "./components/Navbar";
import InteractivePrompts from "./components/InteractivePrompts";
import Testimonials from "./components/Testimonials";
import FaqSection from "./components/FaqSection";
import RegistrationModal from "./components/RegistrationModal";
import MemberPortal from "./components/MemberPortal";
import AdminPortal from "./components/AdminPortal";
import UnifiedLogin from "./components/UnifiedLogin";

// Map icon strings to Lucide icon components for dynamic rendering
const iconMap: { [key: string]: ComponentType<any> } = {
  Tv,
  Zap,
  Video,
  DollarSign,
  TrendingUp,
  Users2,
  CheckSquare,
  Flame,
  Lightbulb,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Sparkles,
  Cpu,
  Users
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [initialPromoCode, setInitialPromoCode] = useState("");

  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(() => localStorage.getItem("insaight_is_logged_in") === "true");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem("insaight_is_admin_logged_in") === "true");

  const handleMemberLoginSuccess = (name: string, phone: string) => {
    setIsMemberLoggedIn(true);
    setIsMemberActive(true);
    setIsAdminActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminActive(true);
    setIsMemberActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMemberLogout = () => {
    setIsMemberLoggedIn(false);
    localStorage.removeItem("insaight_is_logged_in");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("insaight_is_admin_logged_in");
  };

  useEffect(() => {
    const path = window.location.pathname;
    const pathCode = path.substring(1).trim();
    const cleanPathCode = pathCode.toUpperCase().replace(/[^A-Z0-9_]/g, "");

    let promoCodeToUse = "";
    if (pathCode && cleanPathCode === pathCode.toUpperCase() && !["ADMIN", "MEMBER", "HOME", "FAQ", "WORKSHOP"].includes(cleanPathCode)) {
      promoCodeToUse = cleanPathCode;
    } else {
      const params = new URLSearchParams(window.location.search);
      const queryCode = params.get("ref") || params.get("promo");
      if (queryCode) {
        promoCodeToUse = queryCode.toUpperCase().replace(/[^A-Z0-9_]/g, "");
      }
    }

    if (promoCodeToUse) {
      setInitialPromoCode(promoCodeToUse);
      // Smoothly scroll to the #join membership plan section with a minor delay so the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById("join");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 600);
      window.history.replaceState({}, document.title, window.location.origin);
    }
  }, []);

  const scrollToJoin = () => {
    const element = document.getElementById("join");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-neumorph text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-slate-900/10 selection:text-slate-800">
      
      {/* Subtle Soft Neumorphic Glow Highlights */}
      <div className="fixed top-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-slate-900/5 filter blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[350px] h-[350px] rounded-full bg-slate-500/5 filter blur-[100px] pointer-events-none z-0" />

      {/* Main navigation */}
      <Navbar 
        onJoinClick={scrollToJoin} 
        onMemberClick={() => {
          if (isAdminLoggedIn) {
            setIsAdminActive(true);
            setIsMemberActive(false);
          } else {
            setIsMemberActive(true);
            setIsAdminActive(false);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        isMemberActive={isMemberActive}
        isAdminActive={isAdminActive}
        onHomeClick={() => {
          setIsMemberActive(false);
          setIsAdminActive(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {isAdminActive ? (
        isAdminLoggedIn ? (
          <AdminPortal 
            onBackToHome={() => {
              setIsAdminActive(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
            onLogout={handleAdminLogout}
          />
        ) : (
          <UnifiedLogin
            initialTab="admin"
            onBackToHome={() => {
              setIsAdminActive(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onMemberLoginSuccess={handleMemberLoginSuccess}
            onAdminLoginSuccess={handleAdminLoginSuccess}
          />
        )
      ) : isMemberActive ? (
        isMemberLoggedIn ? (
          <MemberPortal 
            onBackToHome={() => {
              setIsMemberActive(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
            onLogout={handleMemberLogout}
          />
        ) : (
          <UnifiedLogin
            initialTab="member"
            onBackToHome={() => {
              setIsMemberActive(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onMemberLoginSuccess={handleMemberLoginSuccess}
            onAdminLoginSuccess={handleAdminLoginSuccess}
          />
        )
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative pt-8 pb-20 md:py-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-neu-inset-sm text-xs sm:text-xs font-semibold tracking-wide text-slate-600 bg-[#e2e8f0]">
                <Sparkles className="w-4 h-4 text-slate-800 animate-spin" />
                <span>🚀 insAIght Kendari Membership</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-800">
                Komunitas AI, Skill & <br />
                <span className="bg-gradient-to-r from-black to-slate-600 bg-clip-text text-transparent">
                  Peluang Bertumbuh
                </span>
              </h1>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  Jangan Belajar AI Sendirian.
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Di era AI, yang menang bukan hanya yang paling pintar. Yang menang adalah mereka yang belajar lebih cepat, punya lingkungan yang tepat, dan berani mengambil peluang.
                </p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">insAIght Kendari</span> hadir sebagai komunitas untuk siapa saja yang ingin meningkatkan skill, membangun karya, menemukan peluang baru, hingga menghasilkan penghasilan dengan bantuan AI.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-3">
                <button
                  onClick={scrollToJoin}
                  className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold tracking-wide transition-all shadow-neu-primary hover:bg-slate-800 active:scale-95"
                >
                  Gabung Sekarang
                </button>
                <a
                  href="#apa-yang-didapat"
                  className="px-8 py-4 rounded-full bg-[#e2e8f0] shadow-neu-flat text-slate-700 font-bold tracking-wide transition-all hover:shadow-neu-inset hover:scale-[0.98] text-center"
                >
                  Lihat Benefit
                </a>
              </div>
            </motion.div>

            {/* Hero Card showcasing benefits in detail */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="shadow-neu-flat rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="text-slate-800">🔥</span> Apa yang Didapat?
                  </h3>
                  <span className="text-xs px-2.5 py-1 shadow-neu-inset-sm text-slate-600 font-semibold rounded-md bg-[#e2e8f0]">
                    Premium VIP
                  </span>
                </div>

                <div className="space-y-5">
                  {featuresData.map((item) => {
                    const IconComponent = iconMap[item.icon] || GraduationCap;
                    return (
                      <div key={item.id} className="flex gap-3 items-start group">
                        <div className="w-9 h-9 rounded-xl bg-[#e2e8f0] shadow-neu-flat-sm text-slate-800 flex items-center justify-center font-bold font-mono text-sm shrink-0 group-hover:shadow-neu-inset-sm transition-all duration-300">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authority Stats Bar */}
      <section className="relative py-12 border-y border-[#ffffff]/50 shadow-neu-flat z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-800 bg-gradient-to-r from-black to-slate-600 bg-clip-text text-transparent">300+</span>
              <span className="text-xs text-slate-500 tracking-wider font-semibold uppercase">Premium Members</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-800 bg-gradient-to-r from-black to-slate-600 bg-clip-text text-transparent">15+</span>
              <span className="text-xs text-slate-500 tracking-wider font-semibold uppercase">Live Classes</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-800 bg-gradient-to-r from-black to-slate-600 bg-clip-text text-transparent">120+</span>
              <span className="text-xs text-slate-500 tracking-wider font-semibold uppercase">Premium Prompts</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-slate-800 bg-gradient-to-r from-black to-slate-600 bg-clip-text text-transparent">24/7</span>
              <span className="text-xs text-slate-500 tracking-wider font-semibold uppercase">Discord & WA Grup Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Apa yang Akan Kamu Dapatkan */}
      <section id="apa-yang-didapat" className="relative py-24 z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800">
              Apa yang Akan Kamu Dapatkan?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              insAIght Kendari membekali kamu dengan ekosistem belajar paling lengkap, aplikatif, dan tanpa istilah teknis yang membingungkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Belajar AI dari Dasar Hingga Mahir */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="shadow-neu-flat rounded-3xl p-6 transition-all flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01]"
            >
              <div>
                <div className="text-3xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Belajar AI dari Dasar Hingga Mahir</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pelajari penggunaan AI secara praktis untuk kehidupan sehari-hari, pekerjaan, bisnis, dan proyek pribadi. Belajar tanpa istilah teknis yang membingungkan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aplikatif & Praktis</span>
              </div>
            </motion.div>

            {/* Card 2: Bimbingan dari Ide Sampai Eksekusi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="shadow-neu-flat rounded-3xl p-6 transition-all flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01]"
            >
              <div>
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Bimbingan dari Ide Sampai Eksekusi</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Bukan hanya teori. Kami membantu anggota mengubah ide menjadi proyek nyata.
                </p>
                <div className="space-y-1.5 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl p-3.5">
                  {[
                    "Menemukan ide",
                    "Validasi",
                    "Perencanaan",
                    "Pembuatan",
                    "Launching"
                  ].map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-slate-600">⚡</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Langkah Eksekusi Nyata</span>
              </div>
            </motion.div>

            {/* Card 3: Komunitas yang Aktif & Supportif */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="shadow-neu-flat rounded-3xl p-6 transition-all flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01]"
            >
              <div>
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Komunitas yang Aktif & Supportif</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Belajar akan jauh lebih cepat ketika dilakukan bersama. Di komunitas kamu bisa:
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Bertanya kapan saja</div>
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Diskusi bersama</div>
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Sharing pengalaman</div>
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Minta feedback</div>
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Kolaborasi proyek</div>
                  <div className="flex items-center gap-1"><span className="text-slate-800 font-bold">✔</span> Networking</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suportif 24/7</span>
              </div>
            </motion.div>

            {/* Card 4: Challenge & Project Bersama */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="shadow-neu-flat rounded-3xl p-6 transition-all flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01]"
            >
              <div>
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Challenge & Project Bersama</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Belajar lewat praktik. Setiap anggota dapat mengikuti challenge interaktif bulanan untuk membangun:
                </p>
                <div className="space-y-1.5 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl p-3.5">
                  {["Portofolio", "Skill", "Pengalaman", "Relasi"].map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-slate-600 font-bold">✔</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Learning by Doing</span>
              </div>
            </motion.div>

            {/* Card 5: Update AI Terbaru */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="shadow-neu-flat rounded-3xl p-6 transition-all flex flex-col justify-between hover:shadow-neu-flat-lg hover:scale-[1.01]"
            >
              <div>
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Update AI Terbaru</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Tidak perlu bingung mengikuti perkembangan AI. Kami akan membagikan kurasi teruji secara berkala:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl p-3.5">
                  <div>🔥 AI Tools Baru</div>
                  <div>🔥 Prompt Baru</div>
                  <div>🔥 Workflow Baru</div>
                  <div>🔥 Update Fitur</div>
                  <div className="col-span-2">🔥 Peluang Baru</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tetap Relevan</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: AI untuk Apa? */}
      <section id="ai-untuk-apa" className="relative py-24 border-t border-[#ffffff]/50 shadow-neu-inset z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800 flex items-center justify-center gap-3">
              <span>💼</span> AI untuk Apa?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Kuasai implementasi AI praktis di berbagai bidang produktivitas, bisnis, dan karir sampingan kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCasesData.map((usecase, index) => {
              const IconComponent = iconMap[usecase.icon] || Sparkles;
              return (
                <motion.div
                  key={usecase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="shadow-neu-flat rounded-3xl p-6 transition-all group hover:shadow-neu-flat-lg hover:scale-[1.01] flex flex-col bg-[#e2e8f0]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#e2e8f0] shadow-neu-inset-sm text-slate-800 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shadow-neu-inset-sm px-2.5 py-1 rounded-full bg-[#e2e8f0]">
                      <span>✓</span> Aktif
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                    {usecase.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {usecase.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Cocok Untuk */}
      <section id="cocok-untuk" className="relative py-24 border-t border-[#ffffff]/50 shadow-neu-flat z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800">
              Sangat Cocok Untuk
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Komunitas insAIght Kendari terbuka lebar bagi siapa saja yang ingin bersiap menyambut era kecerdasan buatan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {targetAudienceData.map((audience, index) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="shadow-neu-flat rounded-2xl p-4 text-center transition-all cursor-default hover:shadow-neu-inset bg-[#e2e8f0]"
              >
                <div className="text-3xl mb-2">{audience.emoji}</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-2">
                  {audience.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Stage: Live Playground Prompts */}
      <section id="workshop" className="relative py-20 border-t border-[#ffffff]/50 shadow-neu-inset z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Prompt Workspace
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
              Ciptakan perintah siap pakai instan Anda secara interaktif. Sesuaikan parameter di form sebelah kiri dan saksikan script prompt tersusun otomatis di komputer rakitan kami!
            </p>
          </div>

          <InteractivePrompts />
        </div>
      </section>

      {/* Testimonials Block */}
      <section id="testimonials" className="relative py-20 z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Kisah Sukses Anggota
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
              Dengarkan langsung cerita dari kreator konten, desainer freelance, dan wirausahawan lokal Kendari yang melipatgandakan produktivitas harian mereka bersama kami.
            </p>
          </div>

          <Testimonials />
        </div>
      </section>

      {/* Pricing / Join Premium Plan section */}
      <section id="join" className="relative py-20 border-y border-[#ffffff]/50 shadow-neu-inset z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Rencana Keanggotaan
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
              Investasi super terjangkau untuk menguasai teknologi masa depan dan mempercepat karier maupun bisnis digital Anda secara lokal & global.
            </p>
          </div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full rounded-3xl shadow-neu-flat p-8 sm:p-10 text-center relative bg-[#e2e8f0]"
            >
              {/* Recommended badge */}
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full select-none tracking-widest shadow-neu-primary">
                ★ Best Offer ★
              </span>

              <p className="text-xs text-slate-500 mb-6 font-medium">Investasi sekali untuk akses belajar dan ekosistem AI selamanya</p>

              <div className="flex flex-col items-center justify-center gap-2 my-6 text-slate-800 bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-slate-400 line-through">Rp499K</span>
                  <span className="text-4xl sm:text-5xl font-black leading-none tracking-tight bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">Rp149K</span>
                </div>
                <span className="text-xs font-bold text-slate-700 shadow-neu-inset-sm px-3 py-1 rounded-full bg-[#e2e8f0]">
                  Daftar Sekali Berlaku Selamanya
                </span>
              </div>

              {/* Checklist divider */}
              <ul className="text-left space-y-4 my-8 text-sm">
                {[
                  "Grup komunitas premium VIP (24/7 WA)",
                  "Akses materi selamanya",
                  "Mentoring AI Project",
                  "Workflow AI premium",
                  "Update berkala tools AI terbaru",
                  "Challenge & kompetisi kreatif berhadiah",
                ].map((feature, i) => (
                  <li key={i} className="flex gap-3 items-start text-slate-700 text-xs sm:text-sm">
                    <Check className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-extrabold tracking-wide transition-all shadow-neu-primary hover:bg-slate-800 active:scale-95"
              >
                Daftar Sekarang
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Panels */}
      <section id="faq" className="relative py-20 z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
              Masih memiliki tanda tanya tentang membership atau proses belajar kami? Cek rangkuman informasi berikut untuk kejelasan Anda.
            </p>
          </div>

          <FaqSection />
        </div>
      </section>

      {/* Urgent Call to Action */}
      <section className="relative py-20 text-center border-t border-[#ffffff]/50 shadow-neu-inset z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
            AI Bukan Lagi Masa Depan.<br />
            <span className="bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent">AI Adalah Kebutuhan.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Jangan biarkan diri Anda tertinggal di era revolusi digital ini. Bergabung sekarang juga bersama insAIght Kendari untuk membekali masa depan karir dan bisnis Anda secara cerdas.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-full bg-slate-900 text-white font-extrabold shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all"
            >
              <span>Bergabung via WhatsApp</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Footer copyright block */}
      <footer className="relative py-12 border-t border-slate-300 z-10 bg-neumorph text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex justify-center items-center gap-1.5 font-bold text-slate-800 mb-2 selection:bg-transparent">
            <Cpu className="w-5 h-5 text-slate-800 animate-pulse" />
            <span>insAIght Kendari</span>
          </div>
          <p>© 2026 insAIght Kendari — Komunitas AI Kreatif Indonesia. All Rights Reserved.</p>
          <p className="text-[10px] text-slate-400">
            Didesain penuh dedikasi untuk mendukung ekosistem talenta teknologi unggul di Sulawesi Tenggara.
          </p>
        </div>
      </footer>

      {/* Managed dynamic subscription & request registration panel overlay */}
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialPromoCode={initialPromoCode} />
    </div>
  );
}
