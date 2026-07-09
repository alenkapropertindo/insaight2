import React, { useState, useEffect } from "react";
import { X, Check, ArrowRight, Sparkles, Send, Phone, Eye, EyeOff, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { hashPassword } from "../lib/hash";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPromoCode?: string;
}

export default function RegistrationModal({ isOpen, onClose, initialPromoCode = "" }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    promoCode: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        promoCode: initialPromoCode || prev.promoCode
      }));
    }
  }, [isOpen, initialPromoCode]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg("");
  };

  const getWaLink = () => {
    const adminPhone = "6282371068831"; // Target WhatsApp number
    const promoPart = formData.promoCode.trim() 
      ? ` menggunakan Kode Promo/Referral: ${formData.promoCode.trim().toUpperCase()}` 
      : "";
    const textMessage = `Halo Admin insAIght Kendari, saya dengan nama akun ${formData.username.trim()} ingin gabung komunitas${promoPart}.`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(textMessage)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Small client-side validation
    if (!formData.username.trim() || !formData.password.trim() || !formData.promoCode.trim()) {
      setErrorMsg("Mohon isi semua bidang yang diperlukan (Username, Password, Kode Promo)!");
      return;
    }

    try {
      setErrorMsg("");
      const promoInput = formData.promoCode.trim().toUpperCase();
      const cleanUsername = formData.username.trim().toLowerCase();

      // Check if the username is already registered (unique username validation)
      const { data: existingUser, error: usernameCheckError } = await supabase
        .from("members")
        .select("id")
        .eq("username", cleanUsername);

      if (usernameCheckError) {
        throw usernameCheckError;
      }

      if (existingUser && existingUser.length > 0) {
        setErrorMsg("Nama Akun (Username) sudah digunakan! Silakan pilih username yang lain.");
        return;
      }

      // Check if the promo code exists in the database
      const { data: promoOwnerData, error: promoError } = await supabase
        .from("members")
        .select("username")
        .eq("promoCode", promoInput);

      if (promoError) {
        throw promoError;
      }

      if (!promoOwnerData || promoOwnerData.length === 0) {
        setErrorMsg("Kode promo yang anda masukan tidak tersedia.");
        return;
      }

      const referrerName = promoOwnerData[0].username || "Admin";

      const usernameFirstWord = formData.username.toUpperCase().trim().split(" ")[0].replace(/[^A-Z0-9]/g, "");
      const generatedPromo = `${usernameFirstWord || "MEMBER"}_${Math.floor(100 + Math.random() * 900)}`;
      
      const hashedPassword = await hashPassword(formData.password.trim());
      
      const newMember = {
        id: `m-${Date.now()}`,
        phone: "-",
        promoCode: generatedPromo,
        joinedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        status: "Pending", // Status is Pending until verified manually by admin
        referredBy: referrerName,
        role: "member",
        username: cleanUsername,
        password: hashedPassword
      };

      const { error } = await supabase.from("members").insert([newMember]);
      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error signing up to Supabase:", err);
      setErrorMsg(`Gagal mendaftar ke database Supabase: ${err.message || err}`);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      promoCode: initialPromoCode || "",
      username: "",
      password: ""
    });
    setIsSubmitted(false);
    setErrorMsg("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl w-full max-w-lg overflow-hidden relative z-10 p-1 border-0"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:shadow-neu-inset transition-all focus:outline-none"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              // Form Content
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>KOMUNITAS PREMIUM INSAIGHT</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Formulir Pendaftaran</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Isi formulir pendaftaran di bawah ini untuk bergabung dengan komunitas insAIght Kendari.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-100 border border-red-200 text-xs text-red-600 font-bold shadow-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Username field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Nama Akun (Username) Baru *</label>
                    <input
                      required
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Contoh: akhyar99 (untuk login)"
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Password Baru *</label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password untuk login"
                        className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                        id="toggle-register-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Promo Code / Referral Code field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <span>Kode Promo / Referral *</span>
                        {initialPromoCode && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-300 text-slate-700 text-[9px] font-extrabold border border-slate-400/20 uppercase tracking-wider">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Referral Terkunci</span>
                          </span>
                        )}
                      </label>
                      {!initialPromoCode && <span className="text-[10px] text-slate-600 font-bold">Wajib diisi</span>}
                    </div>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleChange}
                        readOnly={!!initialPromoCode}
                        placeholder="Contoh: KENDARI50"
                        className={`w-full shadow-neu-inset-sm rounded-xl pl-4 pr-10 py-2.5 text-sm uppercase focus:outline-none focus:shadow-neu-inset transition-all border-0 tracking-wider font-extrabold ${
                          initialPromoCode
                            ? "bg-slate-300/40 text-slate-700 cursor-not-allowed select-none border border-slate-400/20"
                            : "bg-[#e2e8f0] text-slate-800"
                        }`}
                      />
                      {initialPromoCode && (
                        <div className="absolute right-3 top-3 text-slate-700">
                          <Check className="w-4 h-4 font-bold" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[10px] pt-1">
                      <span className="text-slate-400 font-bold">
                        {initialPromoCode 
                          ? "Kode rujukan terisi otomatis dari link referral Anda." 
                          : "Gunakan kode sponsor Anda untuk pendaftaran"}
                      </span>
                      {!initialPromoCode && (
                        <a
                          href="https://wa.me/6282371068831?text=Halo%20Admin%20insAIght%20Kendari,%20saya%20belum%20memiliki%20kode%20promo%20/%20referral.%20Boleh%20saya%20minta%20kode%20promonya?"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 hover:text-slate-900 font-extrabold flex items-center gap-1 transition-all"
                        >
                          <Phone className="w-2.5 h-2.5 fill-slate-800" />
                          Belum punya kode? Minta via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ajukan Pendaftaran</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              // Success / Redirect Content
              <div className="p-6 sm:p-8 space-y-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center mb-2 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Pendaftaran Diajukan!</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Terima kasih, <span className="font-bold text-slate-800">{formData.username}</span>. Data Anda telah disiapkan.
                  </p>
                  <p className="text-xs text-slate-600 mt-3.5 leading-relaxed bg-[#e2e8f0] shadow-neu-inset rounded-xl p-3 max-w-sm mx-auto text-left font-mono">
                    <strong>Nama Akun (Username):</strong> {formData.username}<br />
                    <strong>Kode Promo/Referral:</strong> {formData.promoCode.trim() ? formData.promoCode.trim().toUpperCase() : "-"}
                  </p>
                </div>

                <div className="space-y-3 pt-3">
                  <p className="text-xs text-slate-500">
                    Jika halaman WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah ini untuk mengirim pesan pendaftaran secara manual.
                  </p>

                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span>Kirim ke WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-600 hover:underline font-bold block mx-auto pt-2"
                  >
                    Daftar dengan nama lain
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
