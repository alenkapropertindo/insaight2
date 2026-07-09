import React, { useState, useEffect } from "react";
import { User, Shield, Lock, Phone, ArrowLeft, Sparkles, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { hashPassword } from "../lib/hash";

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
    username: "",
    password: ""
  });

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: ""
  });

  // Password visibility states
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Forgot Password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: verify, 2: set new, 3: success
  const [forgotForm, setForgotForm] = useState({
    username: "",
    promoCode: "",
    newPassword: ""
  });
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [verifiedMemberId, setVerifiedMemberId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync activeTab if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage(null);
  }, [initialTab]);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = memberForm.username.trim();
    const cleanPassword = memberForm.password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage("Nama Akun (Username) dan Password harus diisi!");
      return;
    }

    try {
      // Look up member by username in Supabase
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("username", cleanUsername.toLowerCase());

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setErrorMessage("Nama Akun (Username) Anda belum terdaftar sebagai member atau tidak aktif. Silakan daftar terlebih dahulu!");
        return;
      }

      // Find the best match or take the first record
      const member = data[0];

      const hashedCleanPassword = await hashPassword(cleanPassword);
      if (member.password !== hashedCleanPassword && member.password !== cleanPassword) {
        setErrorMessage("Password yang Anda masukkan salah!");
        return;
      }

      if (member.status !== "Aktif") {
        setErrorMessage("Akun Anda belum disetujui (status masih 'Pending') atau dinonaktifkan oleh Admin.");
        return;
      }

      // Save user details & reference promo code to localStorage for keeping session
      localStorage.setItem("insaight_is_logged_in", "true");
      localStorage.setItem("insaight_member_name", member.username || member.name);
      localStorage.setItem("insaight_member_phone", member.phone);
      localStorage.setItem("insaight_ref_code", member.promoCode);
      localStorage.setItem("insaight_username", member.username);

      onMemberLoginSuccess(member.username || member.name, member.phone);
    } catch (err: any) {
      console.error("Error logging in with Supabase:", err);
      setErrorMessage(`Gagal menghubungi server database: ${err.message || err}`);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = adminForm.username.trim();
    const cleanPassword = adminForm.password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage("Nama Akun (Username) dan Password Admin harus diisi!");
      return;
    }

    try {
      // Look up member by username in Supabase
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("username", cleanUsername);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setErrorMessage("Nama Akun (Username) tidak terdaftar di sistem!");
        return;
      }

      const member = data[0];

      const hashedCleanPassword = await hashPassword(cleanPassword);
      if (member.password !== hashedCleanPassword && member.password !== cleanPassword) {
        setErrorMessage("Password yang Anda masukkan salah!");
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

  const handleVerifyForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    const cleanUser = forgotForm.username.trim().toLowerCase();
    const cleanPromo = forgotForm.promoCode.trim().toUpperCase();

    if (!cleanUser || !cleanPromo) {
      setForgotError("Harap isi semua kolom untuk verifikasi!");
      setForgotLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("members")
        .select("id, username, promoCode")
        .eq("username", cleanUser);

      if (error) throw error;

      if (!data || data.length === 0) {
        setForgotError("Username tidak terdaftar di sistem!");
        setForgotLoading(false);
        return;
      }

      const match = data.find(
        (m: any) =>
          m.username?.toLowerCase() === cleanUser &&
          m.promoCode?.toUpperCase() === cleanPromo
      );

      if (!match) {
        setForgotError("Kombinasi Username dan Kode Promo/Referral Utama salah!");
        setForgotLoading(false);
        return;
      }

      setVerifiedMemberId(match.id);
      setForgotStep(2);
    } catch (err: any) {
      console.error("Forgot verification error:", err);
      setForgotError(`Gagal melakukan verifikasi: ${err.message || err}`);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    const newPass = forgotForm.newPassword.trim();
    if (!newPass) {
      setForgotError("Password baru tidak boleh kosong!");
      setForgotLoading(false);
      return;
    }

    if (!verifiedMemberId) {
      setForgotError("Sesi verifikasi kadaluarsa. Silakan ulangi.");
      setForgotStep(1);
      setForgotLoading(false);
      return;
    }

    try {
      const hashedPassword = await hashPassword(newPass);
      const { error } = await supabase
        .from("members")
        .update({ password: hashedPassword })
        .eq("id", verifiedMemberId);

      if (error) throw error;

      setForgotStep(3);
    } catch (err: any) {
      console.error("Forgot password reset error:", err);
      setForgotError(`Gagal memperbarui password: ${err.message || err}`);
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotState = () => {
    setForgotStep(1);
    setForgotForm({ username: "", promoCode: "", newPassword: "" });
    setForgotError(null);
    setVerifiedMemberId(null);
    setShowForgotNewPassword(false);
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
            <div className="w-14 h-14 rounded-2xl bg-[#e2e8f0] shadow-neu-inset text-slate-800 flex items-center justify-center mx-auto shadow-sm">
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
                  ? "shadow-neu-flat text-slate-900 bg-[#e2e8f0]"
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
                  ? "shadow-neu-flat text-slate-800 bg-[#e2e8f0]"
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
                  <label className="text-xs font-bold text-slate-600 block text-left">Nama Akun Member (Username) *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Masukkan nama akun / username Anda"
                      value={memberForm.username}
                      onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                 <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type={showMemberPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      value={memberForm.password}
                      onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMemberPassword(!showMemberPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                      id="toggle-member-password"
                    >
                      {showMemberPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetForgotState();
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-slate-700 hover:text-slate-950 hover:underline bg-transparent border-0 cursor-pointer"
                      id="forgot-member-password-btn"
                    >
                      Lupa Password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all mt-4 cursor-pointer"
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
                  <label className="text-xs font-bold text-slate-600 block text-left">Nama Akun Admin (Username) *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Masukkan nama akun / username"
                      value={adminForm.username}
                      onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block text-left">Password Admin *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type={showAdminPassword ? "text" : "password"}
                      placeholder="Masukkan password admin"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                      id="toggle-admin-password"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetForgotState();
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-slate-700 hover:text-slate-950 hover:underline bg-transparent border-0 cursor-pointer"
                      id="forgot-admin-password-btn"
                    >
                      Lupa Password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  Masuk Sebagai Admin
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 sm:p-8 max-w-md w-full relative"
              id="forgot-password-modal"
            >
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Atur Ulang Password</h3>
                <p className="text-xs text-slate-500">
                  {forgotStep === 1 && "Verifikasi akun Anda dengan Username dan Kode Referral Anda."}
                  {forgotStep === 2 && "Masukkan password baru untuk akun Anda."}
                  {forgotStep === 3 && "Password akun Anda berhasil diperbarui!"}
                </p>
              </div>

              {forgotError && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleVerifyForgot} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block text-left">Nama Akun (Username) *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: akhyar99"
                        value={forgotForm.username}
                        onChange={(e) => setForgotForm({ ...forgotForm, username: e.target.value })}
                        className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block text-left">Kode Promo / Referral Anda *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: AKHYAR_123"
                        value={forgotForm.promoCode}
                        onChange={(e) => setForgotForm({ ...forgotForm, promoCode: e.target.value })}
                        className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-left leading-tight mt-1">
                      * Masukkan Kode Promo/Referral milik Anda sendiri untuk membuktikan kepemilikan akun.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-[#e2e8f0] text-slate-600 font-extrabold text-xs shadow-neu-flat hover:shadow-neu-inset transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-neu-primary hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {forgotLoading ? "Memverifikasi..." : "Verifikasi Akun"}
                    </button>
                  </div>

                  <div className="border-t border-slate-300 pt-4 mt-2">
                    <p className="text-[11px] text-slate-500 text-center font-medium">
                      Lupa Kode Referral Anda? Hubungi Admin untuk bantuan manual.
                    </p>
                    <a
                      href={`https://wa.me/6282371068831?text=${encodeURIComponent(
                        "Halo Admin insAIght Kendari, saya lupa password dan kode referral saya. Username akun saya: " + (forgotForm.username || "[Isi Username Anda]")
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2.5 py-2.5 rounded-xl bg-[#e2e8f0] text-slate-800 hover:text-slate-950 font-extrabold text-xs shadow-neu-flat hover:shadow-neu-inset flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hubungi Admin via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block text-left">Password Baru *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type={showForgotNewPassword ? "text" : "password"}
                        placeholder="Masukkan password baru Anda"
                        value={forgotForm.newPassword}
                        onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                        className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 py-2.5 rounded-xl bg-[#e2e8f0] text-slate-600 font-extrabold text-xs shadow-neu-flat hover:shadow-neu-inset transition-all cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-neu-primary hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {forgotLoading ? "Menyimpan..." : "Simpan Password Baru"}
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === 3 && (
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-850 shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Reset Berhasil!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Password baru Anda telah berhasil disimpan di sistem. Silakan login kembali untuk masuk ke Dasbor Member.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-neu-primary hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Masuk Sekarang
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
