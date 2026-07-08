import React, { useState, useEffect } from "react";
import { User, Shield, Lock, Phone, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";

interface UnifiedLoginProps {
  initialTab?: "member" | "admin";
  onBackToHome: () => void;
  onMemberLoginSuccess: (name: string, phone: string) => void;
  onAdminLoginSuccess: () => void;
}

export default function UnifiedLogin({
  initialTab = "member",
  onBackToHome,
  onMemberLoginSuccess,
  onAdminLoginSuccess
}: UnifiedLoginProps) {
  const [activeTab, setActiveTab] = useState<"member" | "admin">(initialTab);
  
  // Member Form State
  const [memberForm, setMemberForm] = useState({
    name: "",
    phone: ""
  });

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    name: "",
    phone: ""
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync activeTab if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage(null);
  }, [initialTab]);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = memberForm.name.trim();
    const cleanPhone = memberForm.phone.trim();

    if (!cleanName || !cleanPhone) {
      setErrorMessage("Nama Lengkap dan Nomor WhatsApp harus diisi!");
      return;
    }

    try {
      // Look up member by phone number in Supabase
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("phone", cleanPhone);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setErrorMessage("Nomor WhatsApp Anda belum terdaftar sebagai member. Silakan daftar terlebih dahulu melalui formulir pendaftaran di halaman utama!");
        return;
      }

      // Find the best match or take the first record
      const member = data[0];

      // Save user details & reference promo code to localStorage for keeping session
      localStorage.setItem("insaight_is_logged_in", "true");
      localStorage.setItem("insaight_member_name", member.name);
      localStorage.setItem("insaight_member_phone", member.phone);
      localStorage.setItem("insaight_ref_code", member.promoCode);

      onMemberLoginSuccess(member.name, member.phone);
    } catch (err: any) {
      console.error("Error logging in with Supabase:", err);
      setErrorMessage(`Gagal menghubungi server database: ${err.message || err}`);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = adminForm.name.trim();
    const cleanPhone = adminForm.phone.trim();

    if (!cleanName || !cleanPhone) {
      setErrorMessage("Nama Lengkap dan Nomor WhatsApp Admin harus diisi!");
      return;
    }

    try {
      // Look up member by phone number in Supabase
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("phone", cleanPhone);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setErrorMessage("Nomor WhatsApp Anda belum terdaftar di sistem!");
        return;
      }

      const member = data[0];

      if (member.name.trim().toLowerCase() !== cleanName.toLowerCase()) {
        setErrorMessage("Nama Lengkap tidak cocok dengan nomor WhatsApp yang diinput!");
        return;
      }

      if (member.role !== "admin") {
        setErrorMessage("Akses ditolak! Akun Anda tidak memiliki peran (role) Admin.");
        return;
      }

      localStorage.setItem("insaight_is_admin_logged_in", "true");
      onAdminLoginSuccess();
    } catch (err: any) {
      console.error("Error logging in Admin with Supabase:", err);
      setErrorMessage(`Gagal menghubungi server database: ${err.message || err}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6"
      >
        {/* Back button */}
        <div className="flex justify-start">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-[#e2e8f0] shadow-neu-flat rounded-xl hover:shadow-neu-inset hover:text-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {/* Logo / Heading */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#e2e8f0] shadow-neu-inset text-[#7b6cff] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Portal Akses insAIght</h2>
            <p className="text-xs text-slate-500">
              Silakan login untuk masuk ke dasbor Anda.
            </p>
          </div>

          {/* Unified Tab Selector */}
          <div className="flex bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl p-1 mb-6 border-0">
            <button
              onClick={() => {
                setActiveTab("member");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "member"
                  ? "shadow-neu-flat text-[#00d4ff] bg-[#e2e8f0]"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sebagai Member</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("admin");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "admin"
                  ? "shadow-neu-flat text-[#7b6cff] bg-[#e2e8f0]"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Sebagai Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Tab Content */}
          <div className="relative">
            {activeTab === "member" ? (
              /* MEMBER LOGIN FORM */
              <motion.form
                key="member"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleMemberSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Nama Lengkap *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Rizqo Fadhilah"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Nomor WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="tel"
                      placeholder="Contoh: 082371068831"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7b6cff] to-[#00d4ff] text-white font-extrabold text-sm shadow-neu-primary hover:opacity-95 active:scale-95 transition-all mt-6 cursor-pointer"
                >
                  Masuk Sebagai Member
                </button>
              </motion.form>
            ) : (
              /* ADMIN LOGIN FORM */
              <motion.form
                key="admin"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAdminSubmit}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Nama Lengkap Admin *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Rizqo Fadhilah"
                      value={adminForm.name}
                      onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Nomor WhatsApp Admin *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="tel"
                      placeholder="Contoh: 082371068831"
                      value={adminForm.phone}
                      onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                {/* Helpful Hint */}
                <div className="bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl p-3.5 text-[11px] text-slate-600 leading-relaxed border-0 mt-2">
                  <span className="font-bold text-[#7b6cff]">💡 Info Akses Admin:</span>
                  <div className="mt-1">
                    Silakan gunakan nama lengkap dan nomor WhatsApp yang telah diatur sebagai <span className="font-bold text-slate-800">Admin</span> di database Supabase untuk masuk.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7b6cff] to-[#00d4ff] text-white font-extrabold text-sm shadow-neu-primary hover:opacity-95 active:scale-95 transition-all mt-6 cursor-pointer"
                >
                  Masuk Sebagai Admin
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
