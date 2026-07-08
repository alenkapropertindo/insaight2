import React, { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Check, 
  X,
  Shield,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface AdminPortalProps {
  onBackToHome: () => void;
  onLogout?: () => void;
}

interface MemberRecord {
  id: string;
  name: string;
  phone: string;
  promoCode: string;
  joinedAt: string;
  status: "Aktif" | "Pending";
  referredBy: string;
  role?: "member" | "admin";
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

export default function AdminPortal({ onBackToHome, onLogout }: AdminPortalProps) {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberFilter, setMemberFilter] = useState<"Semua" | "Aktif" | "Pending">("Semua");
  const [payoutFilter, setPayoutFilter] = useState<"Semua" | "Diajukan" | "Cair" | "Ditolak">("Semua");
  const [notification, setNotification] = useState<string | null>(null);

  // Form for manual member addition
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    promoCode: "",
    referredBy: "",
    status: "Aktif" as "Aktif" | "Pending",
    role: "member" as "member" | "admin"
  });

  const fetchData = async () => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*");

      if (membersError) {
        console.error("Error fetching members:", membersError);
      } else if (membersData) {
        const sortedMembers = [...membersData].sort((a: any, b: any) => b.id.localeCompare(a.id));
        setMembers(sortedMembers);
      }

      const { data: payoutsData, error: payoutsError } = await supabase
        .from("payouts")
        .select("*");

      if (payoutsError) {
        console.error("Error fetching payouts:", payoutsError);
      } else if (payoutsData) {
        const sortedPayouts = [...payoutsData].sort((a: any, b: any) => b.id.localeCompare(a.id));
        setPayouts(sortedPayouts);
      }
    } catch (err) {
      console.error("General error fetching Supabase data:", err);
    }
  };

  // Load and seed initial mock data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.phone.trim()) {
      showToast("Nama dan WhatsApp wajib diisi!");
      return;
    }

    const newRec: MemberRecord = {
      id: `m-${Date.now()}`,
      name: newMember.name,
      phone: newMember.phone,
      promoCode: newMember.promoCode.trim().toUpperCase() || `MEM-${Math.floor(100 + Math.random() * 900)}`,
      joinedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: newMember.status,
      referredBy: newMember.referredBy.trim().toUpperCase() || "-",
      role: newMember.role
    };

    try {
      const { error } = await supabase.from("members").insert([newRec]);
      if (error) throw error;

      setNewMember({ name: "", phone: "", promoCode: "", referredBy: "", status: "Aktif", role: "member" });
      setShowAddForm(false);
      showToast("Anggota Baru berhasil ditambahkan ke sistem!");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menambahkan anggota: ${err.message || err}`);
    }
  };

  const handleVerifyMember = async (id: string) => {
    const targetMember = members.find(m => m.id === id);
    if (!targetMember) return;

    try {
      const { error } = await supabase.from("members").update({ status: "Aktif" }).eq("id", id);
      if (error) throw error;

      showToast(`Akun ${targetMember.name} berhasil diaktifkan!`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal memverifikasi: ${err.message || err}`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data anggota ini?")) {
      try {
        const { error } = await supabase.from("members").delete().eq("id", id);
        if (error) throw error;

        showToast("Anggota berhasil dihapus.");
        fetchData();
      } catch (err: any) {
        console.error(err);
        showToast(`Gagal menghapus: ${err.message || err}`);
      }
    }
  };

  const handleApprovePayout = async (id: string) => {
    try {
      const { error } = await supabase.from("payouts").update({ status: "Selesai" }).eq("id", id);
      if (error) throw error;

      showToast("Permintaan pencairan komisi disetujui & dicairkan! 🎉");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menyetujui payout: ${err.message || err}`);
    }
  };

  const handleRejectPayout = async (id: string) => {
    try {
      const { error } = await supabase.from("payouts").update({ status: "Ditolak" }).eq("id", id);
      if (error) throw error;

      showToast("Permintaan pencairan ditolak.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menolak payout: ${err.message || err}`);
    }
  };

  const handleDeletePayout = async (id: string) => {
    if (confirm("Hapus log payout ini?")) {
      try {
        const { error } = await supabase.from("payouts").delete().eq("id", id);
        if (error) throw error;

        showToast("Log payout dihapus.");
        fetchData();
      } catch (err: any) {
        console.error(err);
        showToast(`Gagal menghapus log payout: ${err.message || err}`);
      }
    }
  };

  // Calculations
  const totalCommisionsPaid = payouts
    .filter(p => p.status === "Selesai")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCommissionsPending = payouts
    .filter(p => p.status === "Menunggu")
    .reduce((sum, p) => sum + p.amount, 0);

  // Helpers
  const getPayoutStatus = (member: MemberRecord) => {
    if (!member.referredBy || member.referredBy === "-") {
      return { text: "-", color: "text-slate-400 bg-slate-100/50 border-slate-200" };
    }
    if (member.status === "Pending") {
      return { text: "Belum Diajukan", color: "text-slate-500 bg-slate-200/50 border-slate-300" };
    }
    if (member.id === "m-2" || member.id === "m-3" || member.id === "m-4") {
      return { text: "Cair", color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
    }
    const matchingPayout = payouts.find(p => p.referredMemberId === member.id);
    if (matchingPayout) {
      if (matchingPayout.status === "Selesai") {
        return { text: "Cair", color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
      } else if (matchingPayout.status === "Menunggu") {
        return { text: "Diajukan", color: "text-amber-700 bg-amber-100 border-amber-200 animate-pulse" };
      } else {
        return { text: "Ditolak", color: "text-red-700 bg-red-100 border-red-200" };
      }
    }
    return { text: "Pending", color: "text-blue-700 bg-blue-100 border-blue-200" };
  };

  // Filters
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.phone.includes(searchQuery) || 
      m.promoCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMemberStatus = memberFilter === "Semua" || m.status === memberFilter;

    let matchesPayoutStatus = true;
    if (payoutFilter !== "Semua") {
      const pStatus = getPayoutStatus(m).text;
      matchesPayoutStatus = pStatus === payoutFilter;
    }

    return matchesSearch && matchesMemberStatus && matchesPayoutStatus;
  });

  const filteredPayouts = payouts.filter(p => {
    const matchesSearch = 
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.refCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (payoutFilter === "Semua") return matchesSearch;
    const payoutRecordStatusMap: Record<string, string> = {
      "Diajukan": "Menunggu",
      "Cair": "Selesai",
      "Ditolak": "Ditolak"
    };
    return matchesSearch && p.status === payoutRecordStatusMap[payoutFilter];
  });

  return (
    <div className="relative min-h-screen bg-[#e2e8f0] text-slate-700 pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10 selection:bg-[#7b6cff]/25 selection:text-[#7b6cff]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-[#e2e8f0] shadow-neu-flat text-[#7b6cff] px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 bg-[#e2e8f0] shadow-neu-flat rounded-xl text-slate-700 hover:shadow-neu-inset hover:text-slate-800 transition-all"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7b6cff] bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded-full border-0 uppercase tracking-wider">
                  Panel Administrator
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Manajemen Anggota & Komisi
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 self-start sm:self-auto">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7b6cff] to-[#00d4ff] text-white font-extrabold text-xs shadow-neu-primary hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Anggota Manual</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat text-red-600 font-extrabold text-xs hover:shadow-neu-inset transition-all cursor-pointer"
              >
                <span>Keluar Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Total Terdaftar</span>
              <Users className="w-4 h-4 text-[#7b6cff]" />
            </div>
            <div className="text-2xl font-black text-slate-800">{members.length}</div>
            <span className="text-[10px] text-slate-400 font-bold">Anggota Komunitas</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Komisi Cair (Lunas)</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">
              Rp {totalCommisionsPaid.toLocaleString("id-ID")}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Telah dikirim ke Wallet</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Komisi Pending</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              Rp {totalCommissionsPending.toLocaleString("id-ID")}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Menunggu Verifikasi Admin</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Rata-rata Konversi</span>
              <TrendingUp className="w-4 h-4 text-[#7b6cff]" />
            </div>
            <div className="text-2xl font-black text-[#7b6cff]">
              {members.length > 0 ? ((members.filter(m => m.referredBy !== "-").length / members.length) * 100).toFixed(0) : 0}%
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Melalui Jalur Referral</span>
          </div>
        </div>

        {/* Manual Member Form Dropdown */}
        {showAddForm && (
          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 space-y-4 border-0">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#7b6cff]" />
              <span>Input Data Anggota Baru Manual</span>
            </h3>
            
            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Nama Lengkap *</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Rian Saputra"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Nomor WhatsApp *</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={newMember.phone}
                  onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Kode Referral Mandiri (Jika Ada)</label>
                <input
                  type="text"
                  placeholder="Contoh: RIAN_CREATOR"
                  value={newMember.promoCode}
                  onChange={e => setNewMember({ ...newMember, promoCode: e.target.value })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-[#7b6cff] placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0 uppercase font-extrabold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Direferensikan Oleh (Kode Teman)</label>
                <input
                  type="text"
                  placeholder="Contoh: RIZQO_INS"
                  value={newMember.referredBy}
                  onChange={e => setNewMember({ ...newMember, referredBy: e.target.value })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0 uppercase font-extrabold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Status Keanggotaan</label>
                <select
                  value={newMember.status}
                  onChange={e => setNewMember({ ...newMember, status: e.target.value as "Aktif" | "Pending" })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:shadow-neu-inset cursor-pointer transition-all border-0 font-bold"
                >
                  <option value="Aktif">Aktif (Lunas)</option>
                  <option value="Pending">Pending (Menunggu Bayar)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Peran (Role) Member</label>
                <select
                  value={newMember.role}
                  onChange={e => setNewMember({ ...newMember, role: e.target.value as "member" | "admin" })}
                  className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:shadow-neu-inset cursor-pointer transition-all border-0 font-bold"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all shadow-md"
                >
                  Simpan & Daftarkan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat text-slate-600 hover:shadow-neu-inset text-xs transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari member, nomor HP, atau kode referral..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Filter Status Member:</span>
              <div className="flex bg-[#e2e8f0] shadow-neu-inset-sm rounded-lg p-0.5 border-0">
                {(["Semua", "Aktif", "Pending"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setMemberFilter(tab)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      memberFilter === tab
                        ? "shadow-neu-inset text-[#7b6cff] bg-[#e2e8f0]"
                        : "text-slate-500 hover:text-slate-800 bg-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Filter Payout:</span>
              <div className="flex bg-[#e2e8f0] shadow-neu-inset-sm rounded-lg p-0.5 border-0">
                {(["Semua", "Diajukan", "Cair", "Ditolak"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPayoutFilter(tab)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      payoutFilter === tab
                        ? "shadow-neu-inset text-[#7b6cff] bg-[#e2e8f0]"
                        : "text-slate-500 hover:text-slate-800 bg-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: MEMBERS & PAYOUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: MEMBER LIST (8 cols) */}
          <div className="lg:col-span-7 bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 space-y-4 border-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7b6cff]" />
                <span>Seluruh Anggota Komunitas ({filteredMembers.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-[#e2e8f0]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e2e8f0]/40 border-b border-slate-300 text-xs text-slate-500 uppercase font-bold">
                    <th className="p-3.5">Nama & Kontak</th>
                    <th className="p-3.5">Referred By</th>
                    <th className="p-3.5">Status Member</th>
                    <th className="p-3.5">Status Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-xs text-slate-600">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        Tidak ada anggota ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-[#e2e8f0]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
                            <span>{member.name}</span>
                            <span className="text-[9px] font-mono font-bold text-[#7b6cff] bg-[#7b6cff]/10 border border-[#7b6cff]/20 px-1 py-0.2 rounded">
                              {member.promoCode}
                            </span>
                            {member.role === "admin" ? (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1 py-0.2 rounded">
                                Admin
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">
                                Member
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{member.phone}</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">Gabung: {member.joinedAt}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-500">
                          {member.referredBy}
                        </td>
                        <td className="p-3.5">
                          {member.status === "Pending" ? (
                            <button
                              onClick={() => handleVerifyMember(member.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border bg-amber-100 hover:bg-emerald-100 text-amber-700 hover:text-emerald-700 border-amber-200 hover:border-emerald-200 animate-pulse transition-all cursor-pointer shadow-sm hover:shadow"
                              title="Klik untuk Aktifkan & Verifikasi Member"
                            >
                              <span>●</span> {member.status} (Aktifkan)
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border bg-emerald-100 text-emerald-700 border-emerald-200">
                              <span>●</span> {member.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {(() => {
                            const pStatus = getPayoutStatus(member);
                            return (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${pStatus.color}`}>
                                <span>●</span> {pStatus.text}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMN 2: PAYOUT REQUESTS (5 cols) */}
          <div className="lg:col-span-5 bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 space-y-4 border-0">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span>Pencairan Payout ({filteredPayouts.length})</span>
            </h3>

            <div className="space-y-4">
              {filteredPayouts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  Tidak ada permintaan pencairan.
                </div>
              ) : (
                filteredPayouts.map(payout => (
                  <div 
                    key={payout.id} 
                    className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 space-y-3 hover:shadow-neu-inset transition-all text-left border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{payout.memberName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">Kode: {payout.refCode} | {payout.requestedAt}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        payout.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : payout.status === "Menunggu"
                          ? "bg-amber-100 text-amber-700 border-amber-200 animate-pulse"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        {payout.status}
                      </span>
                    </div>

                    <div className="bg-[#e2e8f0] shadow-neu-inset rounded-lg p-2.5 space-y-1 font-mono text-[10px] text-slate-600 border-0">
                      <div><strong className="text-slate-400">Tujuan:</strong> {payout.walletType}</div>
                      <div><strong className="text-slate-400">No/ID:</strong> {payout.walletNumber}</div>
                      <div><strong className="text-slate-400">A/N:</strong> {payout.walletOwner}</div>
                      <div className="text-right text-xs font-black text-[#7b6cff] mt-1.5 pt-1 border-t border-slate-300">
                        Rp {payout.amount.toLocaleString("id-ID")}
                      </div>
                    </div>

                    {payout.status === "Menunggu" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePayout(payout.id)}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui (Lunas)</span>
                        </button>
                        <button
                          onClick={() => handleRejectPayout(payout.id)}
                          className="px-2.5 py-1.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-600 hover:text-red-600 text-[10px] font-bold rounded-lg flex items-center justify-center transition-all border-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {payout.status !== "Menunggu" && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeletePayout(payout.id)}
                          className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus Log</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
