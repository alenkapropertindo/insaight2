import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  User, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  Users, 
  Share2, 
  ArrowLeft, 
  Save, 
  Wallet, 
  LogOut, 
  Award, 
  TrendingUp,
  CheckCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Cpu
} from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { hashPassword } from "../lib/hash";
import WorkflowTools from "./WorkflowTools";

interface MemberPortalProps {
  onBackToHome: () => void;
  onLogout?: () => void;
}

interface ReferralRecord {
  id: string;
  name: string;
  date: string;
  memberStatus: "Aktif" | "Pending";
  payoutStatus: "Cair" | "Diajukan" | "Pending" | "Belum Diajukan" | "Ditolak";
  commission: number;
}

interface MemberRecord {
  id: string;
  name?: string;
  phone: string;
  promoCode: string;
  joinedAt: string;
  status: "Aktif" | "Pending";
  referredBy: string;
  role?: "member" | "admin";
  username: string;
}

interface PayoutRecord {
  id: string;
  memberName: string;
  refCode: string;
  amount: number;
  walletType: string;
  walletNumber: string;
  walletOwner: string;
  requestedAt: string;
  status: "Menunggu" | "Selesai" | "Ditolak";
  referredMemberId?: string;
}

export default function MemberPortal({ onBackToHome, onLogout }: MemberPortalProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "workflow">("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    name: "Rizqo Fadhilah",
    phone: "082371068831"
  });

  // User Settings stored in LocalStorage for persistence
  const [refCode, setRefCode] = useState("RIZQO_INS");
  const [walletType, setWalletType] = useState("Dana");
  const [walletNumber, setWalletNumber] = useState("082371068831");
  const [walletOwner, setWalletOwner] = useState("Rizqo Fadhilah");
  const [memberPhone, setMemberPhone] = useState("-");
  const [username, setUsername] = useState("");

  // Password reset states
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);

  const fetchData = async () => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*");

      if (membersError) {
        console.error("Error fetching members:", membersError);
      } else if (membersData) {
        setMembers(membersData);
      }

      const { data: payoutsData, error: payoutsError } = await supabase
        .from("payouts")
        .select("*");

      if (payoutsError) {
        console.error("Error fetching payouts:", payoutsError);
      } else if (payoutsData) {
        setPayouts(payoutsData);
      }
    } catch (err) {
      console.error("Error loading Supabase data inside MemberPortal:", err);
    }
  };

  // Load members and payouts from Supabase when logged in or refCode changes
  useEffect(() => {
    fetchData();
  }, [isLoggedIn, refCode]);

  // Load custom values from LocalStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem("insaight_ref_code");
    const savedWalletType = localStorage.getItem("insaight_wallet_type");
    const savedWalletNum = localStorage.getItem("insaight_wallet_num");
    const savedWalletOwner = localStorage.getItem("insaight_wallet_owner");
    const savedLogin = localStorage.getItem("insaight_is_logged_in");
    const savedName = localStorage.getItem("insaight_member_name");
    const savedPhone = localStorage.getItem("insaight_member_phone");
    const savedUsername = localStorage.getItem("insaight_username");

    if (savedCode) setRefCode(savedCode);
    if (savedWalletType) setWalletType(savedWalletType);
    if (savedWalletNum) setWalletNumber(savedWalletNum);
    if (savedWalletOwner) setWalletOwner(savedWalletOwner);
    if (savedLogin === "true") setIsLoggedIn(true);
    if (savedName) setLoginForm(prev => ({ ...prev, name: savedName }));
    if (savedPhone) {
      setLoginForm(prev => ({ ...prev, phone: savedPhone }));
      setMemberPhone(savedPhone);
    }
    if (savedUsername) setUsername(savedUsername);

    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.name.trim() || !loginForm.phone.trim()) {
      showNotification("Nama dan Nomor WhatsApp harus diisi!");
      return;
    }
    setIsLoggedIn(true);
    localStorage.setItem("insaight_is_logged_in", "true");
    localStorage.setItem("insaight_member_name", loginForm.name);
    localStorage.setItem("insaight_member_phone", loginForm.phone);
    showNotification("Selamat datang di Portal Member insAIght!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("insaight_is_logged_in");
    showNotification("Berhasil keluar dari Portal Member.");
    if (onLogout) onLogout();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = refCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    if (!formattedCode) {
      showNotification("Kode referral tidak boleh kosong dan hanya boleh alfanumerik!");
      return;
    }

    const cleanPhone = memberPhone.trim();
    if (!cleanPhone || cleanPhone === "-") {
      showNotification("Nomor WhatsApp wajib diisi!");
      return;
    }

    // Check if user is changing password
    const hasNewPassword = newPasswordInput.trim() !== "";
    if (hasNewPassword) {
      if (newPasswordInput !== confirmPasswordInput) {
        showNotification("Password baru dan Konfirmasi Password tidak cocok!");
        return;
      }
    }

    try {
      const savedUsername = localStorage.getItem("insaight_username") || username;
      if (savedUsername) {
        // Build update object
        const updateData: any = {
          phone: cleanPhone
          // promoCode is permanently locked to prevent editing by member or admin
        };

        if (hasNewPassword) {
          updateData.password = await hashPassword(newPasswordInput.trim());
        }

        // Update Supabase database
        const { error: dbError } = await supabase
          .from("members")
          .update(updateData)
          .eq("username", savedUsername);

        if (dbError) {
          throw dbError;
        }
      }

      setLoginForm(prev => ({ ...prev, phone: cleanPhone }));
      localStorage.setItem("insaight_member_phone", cleanPhone);
      localStorage.setItem("insaight_wallet_type", walletType);
      localStorage.setItem("insaight_wallet_num", walletNumber);
      localStorage.setItem("insaight_wallet_owner", walletOwner);
      
      let successMsg = "Pengaturan Profil, Nomor WhatsApp & Kode Referral berhasil disimpan!";
      if (hasNewPassword) {
        successMsg = "Profil & Password baru Anda berhasil disimpan!";
        setNewPasswordInput("");
        setConfirmPasswordInput("");
      }
      showNotification(successMsg);
    } catch (err: any) {
      console.error("Error updating member profile in Supabase:", err);
      showNotification(`Gagal menyimpan ke database: ${err.message || err}`);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const getReferralLink = () => {
    return `${window.location.origin}/${refCode.toUpperCase()}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getReferralLink());
    showNotification("Tautan referral berhasil disalin ke papan klip! 🚀");
  };

  const copyPromoOnly = () => {
    navigator.clipboard.writeText(refCode);
    showNotification(`Kode Promo "${refCode}" berhasil disalin!`);
  };

  // Dynamic metrics from LocalStorage members and payouts
  const totalClicks = 142; // static simulated clicks
  
  const referrals = useMemo(() => {
    // Find all members referred by the current user's refCode or username
    const myReferred = members.filter(m => {
      if (!m.referredBy) return false;
      const isPromoMatch = m.referredBy.toUpperCase() === refCode.toUpperCase();
      const isUsernameMatch = username && m.referredBy.toLowerCase() === username.toLowerCase();
      return isPromoMatch || isUsernameMatch;
    });
    
    return myReferred.map(m => {
      let payoutStatus: "Cair" | "Diajukan" | "Pending" | "Belum Diajukan" | "Ditolak" = "Pending";
      
      if (m.status === "Pending") {
        payoutStatus = "Belum Diajukan";
      } else {
        // Look up corresponding payout record in database
        const matchingPayout = payouts.find(p => p.referredMemberId === m.id);
        if (matchingPayout) {
          if (matchingPayout.status === "Selesai") {
            payoutStatus = "Cair";
          } else if (matchingPayout.status === "Menunggu") {
            payoutStatus = "Diajukan";
          } else {
            payoutStatus = "Ditolak";
          }
        } else {
          payoutStatus = "Pending";
        }
      }

      return {
        id: m.id,
        name: m.username || m.name,
        date: m.joinedAt,
        memberStatus: m.status, // "Aktif" | "Pending"
        payoutStatus,
        commission: 50000
      };
    });
  }, [members, payouts, refCode]);

  const totalEarnings = useMemo(() => {
    return referrals
      .filter(r => r.payoutStatus === "Cair")
      .reduce((sum, r) => sum + r.commission, 0);
  }, [referrals]);

  const pendingEarnings = useMemo(() => {
    return referrals
      .filter(r => r.payoutStatus === "Diajukan")
      .reduce((sum, r) => sum + r.commission, 0);
  }, [referrals]);

  const claimableEarnings = useMemo(() => {
    return referrals
      .filter(r => r.payoutStatus === "Pending")
      .reduce((sum, r) => sum + r.commission, 0);
  }, [referrals]);

  const verifiedReferralsCount = useMemo(() => {
    return referrals.filter(r => r.memberStatus === "Aktif").length;
  }, [referrals]);

  const handleRequestIndividualPayout = async (referredId: string, referredName: string) => {
    const newPayout: PayoutRecord = {
      id: `p-${Date.now()}`,
      memberName: loginForm.name,
      refCode: refCode,
      amount: 50000,
      walletType: walletType,
      walletNumber: walletNumber,
      walletOwner: walletOwner,
      requestedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: "Menunggu",
      referredMemberId: referredId
    };

    try {
      const { error } = await supabase.from("payouts").insert([newPayout]);
      if (error) throw error;

      fetchData();

      const adminPhone = "6282371068831";
      const waText = `Halo Admin insAIght Kendari, saya ${loginForm.name} ingin mengajukan pencairan komisi affiliate sebesar Rp 50.000 atas pendaftaran member "${referredName}".

Metode Payout: ${walletType}
No Rekening/E-Wallet: ${walletNumber}
Atas Nama: ${walletOwner}

Mohon bantu proses pencairannya. Terima kasih! 🚀`;

      showNotification(`Berhasil mengajukan komisi untuk ${referredName}! Membuka WhatsApp...`);
      setTimeout(() => {
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(waText)}`, "_blank");
      }, 1200);
    } catch (err: any) {
      console.error(err);
      showNotification(`Gagal mengajukan pencairan: ${err.message || err}`);
    }
  };

  const handleRequestAllPayouts = async () => {
    const claimableReferrals = referrals.filter(r => r.payoutStatus === "Pending");
    if (claimableReferrals.length === 0) return;

    const newPayouts: PayoutRecord[] = claimableReferrals.map(r => ({
      id: `p-${Date.now()}-${r.id}`,
      memberName: loginForm.name,
      refCode: refCode,
      amount: r.commission,
      walletType: walletType,
      walletNumber: walletNumber,
      walletOwner: walletOwner,
      requestedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: "Menunggu",
      referredMemberId: r.id
    }));

    try {
      const { error } = await supabase.from("payouts").insert(newPayouts);
      if (error) throw error;

      fetchData();

      const adminPhone = "6282371068831";
      const waText = `Halo Admin insAIght Kendari, saya ${loginForm.name} ingin mengajukan pencairan komisi affiliate dari kode referral "${refCode}" sebesar Rp ${claimableEarnings.toLocaleString("id-ID")}.

Metode Payout: ${walletType}
No Rekening/E-Wallet: ${walletNumber}
Atas Nama: ${walletOwner}

Mohon bantu proses pencairannya. Terima kasih! 🚀`;

      showNotification(`Berhasil mengajukan ${claimableReferrals.length} komisi! Membuka WhatsApp...`);
      setTimeout(() => {
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(waText)}`, "_blank");
      }, 1200);
    } catch (err: any) {
      console.error(err);
      showNotification(`Gagal mengajukan pencairan: ${err.message || err}`);
    }
  };

  const handleWithdraw = () => {
    const adminPhone = "6282371068831";
    const waText = `Halo Admin insAIght Kendari, saya ${loginForm.name} ingin mengajukan pencairan komisi affiliate dari kode referral "${refCode}" sebesar Rp ${totalEarnings.toLocaleString("id-ID")}.

Metode Payout: ${walletType}
No Rekening/E-Wallet: ${walletNumber}
Atas Nama: ${walletOwner}

Mohon bantu proses pencairannya. Terima kasih! 🚀`;

    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(waText)}`, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-[#e2e8f0] text-slate-700 pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10 selection:bg-slate-300 selection:text-slate-900">
      {/* Floating alert */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-slate-200 border border-slate-300 text-slate-800 px-4 py-3 rounded-xl shadow-md flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 bg-[#e2e8f0] shadow-neu-flat rounded-xl text-slate-700 hover:shadow-neu-inset hover:text-slate-800 transition-all"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-850 bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded-full border-0 uppercase tracking-wider">
                  Program Affiliate
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Portal Member insAIght
              </h1>
            </div>
          </div>
        </div>

        {!isLoggedIn ? (
          /* LOGIN PANEL / REGISTRATION AREA */
          <div className="max-w-md mx-auto py-12">
            <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 sm:p-8 relative">
              <div className="text-center space-y-2 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#e2e8f0] shadow-neu-inset text-slate-800 flex items-center justify-center mx-auto shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Masuk Area Member</h3>
                <p className="text-xs text-slate-500">
                  Gunakan nama dan nomor WhatsApp Anda untuk mengelola link affiliate dan memonitor komisi Anda.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Nama Akun (Username) *</label>
                  <input
                    required
                    type="text"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    placeholder="Contoh: riansaputra"
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Nomor WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="Contoh: 082371068831"
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all mt-6"
                >
                  Masuk Sekarang
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-300 text-center">
                <button 
                  onClick={onBackToHome}
                  className="text-xs text-slate-700 hover:text-slate-950 hover:underline font-bold"
                >
                  Kembali ke Halaman Utama
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PORTAL DASHBOARD AND PROFILING CONTENT */
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            
            {/* Mobile Top Toggle Bar (visible only on mobile) */}
            <div className="lg:hidden w-full bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e2e8f0] shadow-neu-inset flex items-center justify-center text-xs font-black text-slate-800">
                  {loginForm.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Navigasi</span>
                  <span className="text-xs font-bold text-slate-800">
                    {activeTab === "dashboard" 
                      ? "Affiliate Dashboard" 
                      : activeTab === "profile" 
                      ? "Pengaturan Profil" 
                      : "Workflow & Tools"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-xl bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-600 transition-all"
                title="Toggle Menu"
              >
                {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            </div>

            {/* Sidebar Navigation */}
            <div 
              className={`bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-5 border-0 transition-all duration-300 flex flex-col justify-between shrink-0 ${
                isSidebarCollapsed 
                  ? "hidden lg:flex lg:w-20 w-full" 
                  : "flex lg:w-72 w-full"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  {!isSidebarCollapsed && (
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Navigasi Area
                    </span>
                  )}
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex p-1.5 rounded-lg bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all ml-auto animate-fade-in"
                    title={isSidebarCollapsed ? "Perluas Sidebar" : "Lipat Sidebar"}
                  >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                </div>

                {/* User Info Block */}
                <div className="mb-6 pb-5 border-b border-slate-300 flex flex-col">
                  {isSidebarCollapsed ? (
                    <>
                      {/* Collapsed view on desktop, fully shown as wide panel on mobile */}
                      <div 
                        className="hidden lg:flex w-10 h-10 rounded-full bg-[#e2e8f0] shadow-neu-inset items-center justify-center text-xs font-black text-slate-800 cursor-pointer mx-auto"
                        title={`${loginForm.name} (Kode: ${refCode})`}
                      >
                        {loginForm.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="lg:hidden w-full flex items-center gap-3 bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-3">
                        <div className="w-10 h-10 rounded-full bg-[#e2e8f0] shadow-neu-inset flex items-center justify-center text-sm font-black text-slate-800 shrink-0">
                          {loginForm.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left overflow-hidden">
                          <div className="text-xs font-bold text-slate-800 truncate" title={loginForm.name}>
                            {loginForm.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold font-mono truncate">
                            Kode: {refCode}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-3">
                      <div className="w-10 h-10 rounded-full bg-[#e2e8f0] shadow-neu-inset flex items-center justify-center text-sm font-black text-slate-800 shrink-0">
                        {loginForm.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 truncate" title={loginForm.name}>
                          {loginForm.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold font-mono truncate">
                          Kode: {refCode}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab("dashboard");
                      if (window.innerWidth < 1024) {
                        setIsSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === "dashboard"
                        ? "shadow-neu-inset text-slate-900 bg-[#e2e8f0]"
                        : "text-slate-600 hover:text-slate-800 hover:shadow-neu-inset-sm bg-transparent"
                    } ${isSidebarCollapsed ? "lg:justify-center justify-start" : "justify-start"}`}
                    title="Affiliate Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span className={isSidebarCollapsed ? "lg:hidden block" : "block"}>
                      Affiliate Dashboard
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      if (window.innerWidth < 1024) {
                        setIsSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === "profile"
                        ? "shadow-neu-inset text-slate-900 bg-[#e2e8f0]"
                        : "text-slate-600 hover:text-slate-800 hover:shadow-neu-inset-sm bg-transparent"
                    } ${isSidebarCollapsed ? "lg:justify-center justify-start" : "justify-start"}`}
                    title="Pengaturan Referral & Profil"
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <span className={isSidebarCollapsed ? "lg:hidden block" : "block"}>
                      Pengaturan Profil
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("workflow");
                      if (window.innerWidth < 1024) {
                        setIsSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === "workflow"
                        ? "shadow-neu-inset text-slate-900 bg-[#e2e8f0]"
                        : "text-slate-600 hover:text-slate-800 hover:shadow-neu-inset-sm bg-transparent"
                    } ${isSidebarCollapsed ? "lg:justify-center justify-start" : "justify-start"}`}
                    title="Workflow & Tools"
                  >
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span className={isSidebarCollapsed ? "lg:hidden block" : "block"}>
                      Workflow & Tools
                    </span>
                  </button>
                </div>
              </div>

              {/* Sidebar Footer Section */}
              <div className="pt-5 border-t border-slate-300 mt-6 space-y-2">
                <button
                  onClick={onBackToHome}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 transition-all bg-transparent ${
                    isSidebarCollapsed ? "lg:justify-center justify-start" : "justify-start"
                  }`}
                  title="Kembali ke Beranda"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden block" : "block"}>
                    Kembali ke Beranda
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all bg-transparent ${
                    isSidebarCollapsed ? "lg:justify-center justify-start" : "justify-start"
                  }`}
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden block" : "block"}>
                    Keluar
                  </span>
                </button>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 w-full space-y-6">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  
                  {/* Headline Stats Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="text-xs font-bold">Total Klik</span>
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-800">{totalClicks}</div>
                      <span className="text-[10px] text-slate-400 font-semibold">Kunjungan tautan unik</span>
                    </div>

                    <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="text-xs font-bold">Total Referral</span>
                        <Users className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-800">{referrals.length}</div>
                      <span className="text-[10px] text-slate-600 font-bold">{verifiedReferralsCount} Terverifikasi</span>
                    </div>

                    <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="text-xs font-bold">Komisi Cair</span>
                        <DollarSign className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-950">
                        Rp {totalEarnings.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Siap dicairkan</span>
                    </div>

                    <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="text-xs font-bold">Komisi Menunggu</span>
                        <Wallet className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-2xl font-black text-slate-700">
                        Rp {pendingEarnings.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Menunggu pembayaran</span>
                    </div>
                  </div>

                  {/* Referral Link & Promo Share Board */}
                  <div className="shadow-neu-flat rounded-3xl p-6 space-y-4 bg-[#e2e8f0] border-0">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-slate-800" />
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight">Bagikan & Cari Komisi</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kamu mendapatkan komisi sebesar <span className="text-slate-900 font-extrabold">Rp 50.000,-</span> untuk setiap pendaftar baru yang menggunakan kode promo atau link referral milikmu.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Unique Referral Link Card */}
                      <div className="bg-[#e2e8f0] shadow-neu-inset rounded-xl p-4 space-y-2 text-left border-0">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Tautan Referral Kamu:</span>
                        </div>
                        <div className="bg-[#e2e8f0] shadow-neu-inset-sm rounded-lg p-2.5 flex items-center justify-between gap-2 border-0">
                          <span className="text-xs font-mono text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap">
                            {getReferralLink()}
                          </span>
                          <button
                            onClick={copyToClipboard}
                            className="p-1.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-800 rounded-md transition-all shrink-0"
                            title="Salin Tautan"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Code Promo Card */}
                      <div className="bg-[#e2e8f0] shadow-neu-inset rounded-xl p-4 space-y-2 text-left border-0">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Kode Promo Kamu:</span>
                        </div>
                        <div className="bg-[#e2e8f0] shadow-neu-inset-sm rounded-lg p-2.5 flex items-center justify-between gap-2 border-0">
                          <span className="text-sm font-black font-mono text-slate-900 tracking-wider">
                            {refCode}
                          </span>
                          <button
                            onClick={copyPromoOnly}
                            className="p-1.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-800 rounded-md transition-all shrink-0"
                            title="Salin Kode Promo"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Commission Cash-out CTA */}
                    {claimableEarnings > 0 && (
                      <div className="bg-slate-200 border border-slate-300 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                        <div className="flex gap-3 items-start text-left">
                          <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center shrink-0 border border-slate-400/20">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Komisi Siap Dicairkan!</h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Ada saldo komisi sebesar <span className="text-slate-950 font-bold">Rp {claimableEarnings.toLocaleString("id-ID")}</span> dari referal aktif yang belum kamu ajukan.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRequestAllPayouts}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Phone className="w-3.5 h-3.5 fill-white" />
                          <span>Ajukan & Tarik Semua via WA</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Referral History / Ledger */}
                  <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 space-y-4 border-0">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <Users className="w-4.5 h-4.5 text-slate-800" />
                      <span>Daftar Transaksi Referral</span>
                    </h3>

                    <div className="overflow-x-auto rounded-2xl border border-slate-300">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#e2e8f0]/40 border-b border-slate-300 text-xs text-slate-500 uppercase font-bold">
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">Tanggal Pendaftaran</th>
                            <th className="p-4">Status Member</th>
                            <th className="p-4">Status Payout</th>
                            <th className="p-4 text-right">Potensi Komisi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-xs text-slate-600">
                          {referrals.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                                Belum ada pendaftaran melalui referral kamu.
                              </td>
                            </tr>
                          ) : (
                            referrals.map((item) => (
                              <tr key={item.id} className="hover:bg-[#e2e8f0]/60 transition-colors">
                                <td className="p-4 font-bold text-slate-800">{item.name}</td>
                                <td className="p-4 font-mono text-slate-500">{item.date}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                    item.memberStatus === "Aktif"
                                      ? "bg-slate-300 text-slate-850 border-slate-400/20"
                                      : "bg-slate-200 text-slate-600 border-slate-300"
                                  }`}>
                                    <span>●</span> {item.memberStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                      item.payoutStatus === "Cair"
                                        ? "bg-slate-300 text-slate-850 border-slate-400/20"
                                        : item.payoutStatus === "Diajukan"
                                        ? "bg-slate-250 text-slate-700 border-slate-300"
                                        : item.payoutStatus === "Pending"
                                        ? "bg-slate-200 text-slate-600 border-slate-300"
                                        : item.payoutStatus === "Ditolak"
                                        ? "bg-slate-250 text-slate-400 border-slate-300/40 line-through"
                                        : "bg-slate-200 text-slate-500 border-slate-300"
                                    }`}>
                                      <span>●</span> {item.payoutStatus}
                                    </span>
                                    {item.payoutStatus === "Pending" && (
                                      <button
                                        onClick={() => handleRequestIndividualPayout(item.id, item.name)}
                                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-md shadow-sm transition-all flex items-center gap-1 shrink-0"
                                        title="Ajukan pembayaran komisi ini"
                                      >
                                        Ajukan
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-right font-black text-slate-800">
                                  Rp {item.commission.toLocaleString("id-ID")}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WORKFLOW & TOOLS */}
              {activeTab === "workflow" && (
                <WorkflowTools memberName={loginForm.name} />
              )}

              {/* TAB 2: PROFILE & SETTINGS */}
              {activeTab === "profile" && (
                <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 space-y-6 border-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Kustomisasi Kode Referral</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Kustomisasikan kode promo/referral kamu sendiri dan atur detail rekening bank / e-wallet untuk keperluan pencairan komisi.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Referral Code customization */}
                      <div className="bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-5 space-y-4 border-0">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Kode Referral & Promo
                        </h4>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                              <span>Kode Kustom</span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-300 text-slate-600 text-[9px] font-extrabold border border-slate-400/20 uppercase tracking-wider">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Permanen</span>
                              </span>
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              readOnly
                              type="text"
                              value={refCode}
                              className="w-full bg-slate-300/40 shadow-neu-inset-sm rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-500 font-extrabold uppercase tracking-wider focus:outline-none cursor-not-allowed border-0 select-none"
                            />
                            <div className="absolute right-3.5 top-3.5 text-slate-400">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                            * Kode referral Anda bersifat permanen dan tidak dapat diubah oleh member maupun admin demi menjamin keandalan sistem pelacakan komisi rujukan Anda.
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label className="text-xs font-bold text-slate-600">Nomor WhatsApp Member</label>
                          <input
                            required
                            type="tel"
                            value={memberPhone}
                            onChange={(e) => setMemberPhone(e.target.value)}
                            placeholder="Contoh: 082371068831"
                            className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                          />
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                            * Masukkan nomor WhatsApp aktif Anda agar Admin dapat memverifikasi atau memproses pembayaran komisi Anda.
                          </p>
                        </div>
                      </div>

                      {/* Right: Payment detail */}
                      <div className="bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-5 space-y-4 border-0">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Tujuan Payout / Pencairan
                        </h4>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Metode Pembayaran</label>
                          <select
                            value={walletType}
                            onChange={(e) => setWalletType(e.target.value)}
                            className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:shadow-neu-inset cursor-pointer transition-all border-0 font-bold"
                          >
                            <option value="Dana">DANA</option>
                            <option value="Gopay">GoPay</option>
                            <option value="OVO">OVO</option>
                            <option value="BCA">Bank BCA</option>
                            <option value="Bank Mandiri">Bank Mandiri</option>
                            <option value="BRI">Bank BRI</option>
                            <option value="Lainnya">Lainnya (Hubungi Admin)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Nomor Rekening / E-Wallet</label>
                          <input
                            required
                            type="text"
                            value={walletNumber}
                            onChange={(e) => setWalletNumber(e.target.value)}
                            placeholder="Contoh: 082371068831 / 123-456-789"
                            className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Nama Pemilik Rekening</label>
                          <input
                            required
                            type="text"
                            value={walletOwner}
                            onChange={(e) => setWalletOwner(e.target.value)}
                            placeholder="Atas nama siapa rekening terdaftar"
                            className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Atur Ulang Password Section */}
                    <div className="bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-5 space-y-4 border-0 mt-6" id="member-password-reset-section">
                      <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-800" />
                        <span>Atur Ulang Password Akun</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Password Baru</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              placeholder="Masukkan password baru"
                              className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                              id="toggle-member-new-password"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Konfirmasi Password Baru</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              placeholder="Ketik ulang password baru"
                              className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none bg-transparent border-0 cursor-pointer"
                              id="toggle-member-confirm-password"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                        * Kosongkan kolom di atas jika Anda tidak ingin mengubah password login Anda saat ini.
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-300">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-neu-primary hover:bg-slate-800 active:scale-95 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Pengaturan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
