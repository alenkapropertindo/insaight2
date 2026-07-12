import React, { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Search, 
  Trash2, 
  ArrowLeft, 
  Check, 
  X,
  Shield,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Plus,
  Sparkles,
  Play,
  Edit3,
  ExternalLink,
  Copy,
  FileText,
  HelpCircle,
  RefreshCw,
  Save,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Unlock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { defaultWorkflowsData, WorkflowItem } from "../defaultWorkflows";
import CoursePageView from "./CoursePageView";

function getYoutubeEmbedUrl(url: string): string {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const cleanUrl = url.trim();
  if (cleanUrl.includes("/embed/")) {
    return cleanUrl;
  }
  let videoId = "";
  if (cleanUrl.includes("v=")) {
    const parts = cleanUrl.split("v=");
    if (parts[1]) {
      videoId = parts[1].split("&")[0];
    }
  } else if (cleanUrl.includes("youtu.be/")) {
    const parts = cleanUrl.split("youtu.be/");
    if (parts[1]) {
      videoId = parts[1].split("?")[0];
    }
  } else if (cleanUrl.includes("/shorts/")) {
    const parts = cleanUrl.split("/shorts/");
    if (parts[1]) {
      videoId = parts[1].split("?")[0];
    }
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return cleanUrl;
}

interface AdminPortalProps {
  onBackToHome: () => void;
  onLogout?: () => void;
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
  password?: string;
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
  
  // State for beautiful confirmation dialog
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberFilter, setMemberFilter] = useState<"Semua" | "Aktif" | "Pending">("Semua");
  const [payoutFilter, setPayoutFilter] = useState<"Semua" | "Diajukan" | "Cair" | "Ditolak">("Semua");
  const [notification, setNotification] = useState<string | null>(null);

  // Tab State for Admin Navigation
  const [activeAdminTab, setActiveAdminTab] = useState<"members" | "materials">("members");

  // Material Management States
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<WorkflowItem | null>(null);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Interactive Preview States (matching member portal)
  const [activeAdminCategory, setActiveAdminCategory] = useState("Semua Kategori");
  const [selectedPromptItem, setSelectedPromptItem] = useState<WorkflowItem | null>(null);
  const [selectedMateriItem, setSelectedMateriItem] = useState<WorkflowItem | null>(null);
  const [activeTutorialVideoItem, setActiveTutorialVideoItem] = useState<WorkflowItem | null>(null);
  const [promptVariables, setPromptVariables] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Material Form States
  const [matCategory, setMatCategory] = useState("AI Video");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matDescription, setMatDescription] = useState("");
  const [matDuration, setMatDuration] = useState("");
  const [matYoutubeUrl, setMatYoutubeUrl] = useState("");
  const [matGeminiToolUrl, setMatGeminiToolUrl] = useState("https://gemini.google.com");
  const [matPromptTemplate, setMatPromptTemplate] = useState("");
  const [matVariables, setMatVariables] = useState<{ key: string; value: string }[]>([]);
  const [matOverview, setMatOverview] = useState("");
  const [matSteps, setMatSteps] = useState<string[]>([""]);
  const [matTips, setMatTips] = useState<string[]>([""]);
  const [matIsDraft, setMatIsDraft] = useState(true);
  const [matIsPublic, setMatIsPublic] = useState(false);

  // Dynamically generate all unique categories from workflows and predefined defaults
  const defaultCategories = ["AI Video", "Edukasi & Edu", "ASMR", "Renovasi & DIY", "Affiliate UGC", "Lainnya"];
  const uniqueWorkflowCategories = Array.from(new Set(workflows.map(w => w.category).filter(Boolean)));
  const allCategories = Array.from(new Set([...defaultCategories, ...uniqueWorkflowCategories]));

  // Sync / Load Workflows from Supabase with robust fallback
  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoadingWorkflows(true);
      try {
        const { data, error } = await supabase
          .from("workflows")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching workflows from Supabase:", error);
          loadFallback();
        } else if (data && data.length > 0) {
          const formatted: WorkflowItem[] = data.map((item: any) => ({
            id: item.id,
            category: item.category,
            isNew: item.is_new,
            isDraft: item.is_draft ?? item.materi_tutorial?.is_draft ?? false,
            isPublic: item.is_public ?? item.materi_tutorial?.is_public ?? false,
            title: item.title,
            description: item.description || "",
            promptTemplate: item.prompt_template || "",
            variables: item.variables || {},
            materiTutorial: item.materi_tutorial || { overview: "", steps: [], tips: [], recommendedTools: [] },
            duration: item.duration || "",
            youtubeUrl: item.youtube_url || "",
            geminiToolUrl: item.gemini_tool_url || "",
            roadmap: item.roadmap || []
          }));
          setWorkflows(formatted);
          localStorage.setItem("insaight_workflows", JSON.stringify(formatted));
        } else {
          // Empty workflows table, try to seed
          await seedDefaultWorkflows();
        }
      } catch (err) {
        console.error("Exception fetching workflows:", err);
        loadFallback();
      } finally {
        setLoadingWorkflows(false);
      }
    };

    const loadFallback = () => {
      const stored = localStorage.getItem("insaight_workflows");
      if (stored) {
        try {
          setWorkflows(JSON.parse(stored));
        } catch (err) {
          console.error("Failed to parse stored workflows", err);
          setWorkflows(defaultWorkflowsData);
        }
      } else {
        localStorage.setItem("insaight_workflows", JSON.stringify(defaultWorkflowsData));
        setWorkflows(defaultWorkflowsData);
      }
    };

    const seedDefaultWorkflows = async () => {
      try {
        const rows = defaultWorkflowsData.map(item => ({
          id: item.id,
          category: item.category,
          is_new: item.isNew,
          is_draft: item.isDraft ?? false,
          is_public: item.isPublic ?? false,
          title: item.title,
          description: item.description,
          prompt_template: item.promptTemplate,
          variables: item.variables,
          materi_tutorial: {
            ...item.materiTutorial,
            is_draft: item.isDraft ?? false,
            is_public: item.isPublic ?? false
          },
          duration: item.duration,
          youtube_url: item.youtubeUrl || null,
          gemini_tool_url: item.geminiToolUrl || null,
          roadmap: item.roadmap || []
        }));

        const { error } = await supabase.from("workflows").insert(rows);
        if (error) {
          console.error("Failed to seed default workflows:", error);
        }
      } catch (err) {
        console.error("Seed default workflows exception:", err);
      }
      setWorkflows(defaultWorkflowsData);
      localStorage.setItem("insaight_workflows", JSON.stringify(defaultWorkflowsData));
    };

    fetchWorkflows();
  }, []);

  const handleOpenAddMaterial = () => {
    setNewMaterialTitle("");
    setIsAddMaterialModalOpen(true);
  };

  const handleCreateNewMaterial = () => {
    const title = newMaterialTitle.trim();
    if (!title) {
      showToast("Judul materi wajib diisi!");
      return;
    }

    const newId = `wf-${Date.now()}`;
    const finalCategory = activeAdminCategory !== "Semua Kategori" ? activeAdminCategory : "AI Video";

    const newMaterial: WorkflowItem = {
      id: newId,
      category: finalCategory,
      isNew: true,
      isDraft: true,
      title: title,
      description: "",
      promptTemplate: "",
      variables: {},
      materiTutorial: {
        overview: "",
        steps: [],
        tips: [],
        recommendedTools: []
      },
      duration: "",
      youtubeUrl: "",
      geminiToolUrl: "",
      roadmap: []
    };

    const newWorkflows = [newMaterial, ...workflows];
    setWorkflows(newWorkflows);
    localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));

    // Save to Supabase
    supabase.from("workflows").insert({
      id: newMaterial.id,
      category: newMaterial.category,
      is_new: newMaterial.isNew,
      title: newMaterial.title,
      description: newMaterial.description,
      prompt_template: newMaterial.promptTemplate,
      variables: newMaterial.variables,
      materi_tutorial: {
        ...newMaterial.materiTutorial,
        is_draft: true
      },
      duration: newMaterial.duration,
      youtube_url: newMaterial.youtubeUrl || null,
      gemini_tool_url: newMaterial.geminiToolUrl || null,
      roadmap: newMaterial.roadmap || []
    }).then(({ error }) => {
      if (error) console.error("Error creating workflow in Supabase:", error);
    });

    setIsAddMaterialModalOpen(false);
    setNewMaterialTitle("");
    showToast("Materi baru berhasil ditambahkan! Silakan klik materi tersebut untuk mengedit detailnya.");
  };

  const handleOpenEditMaterial = (item: WorkflowItem) => {
    setEditingMaterial(item);
    
    const itemCat = item.category || "AI Video";
    setMatCategory(itemCat);
    setIsCustomCategory(false);
    setCustomCategory("");
    
    setMatTitle(item.title || "");
    setMatDescription(item.description || "");
    setMatDuration(item.duration || "");
    setMatYoutubeUrl(item.youtubeUrl || "");
    setMatGeminiToolUrl(item.geminiToolUrl || "https://gemini.google.com");
    setMatPromptTemplate(item.promptTemplate || "");
    setMatIsDraft(item.isDraft ?? false);
    setMatIsPublic(item.isPublic ?? false);
    
    // Map variables object to key-value array
    const varsArray = Object.entries(item.variables || {}).map(([key, value]) => ({
      key,
      value: value as string
    }));
    setMatVariables(varsArray.length > 0 ? varsArray : [{ key: "", value: "" }]);
    
    setMatOverview(item.materiTutorial?.overview || "");
    setMatSteps(item.materiTutorial?.steps || [""]);
    setMatTips(item.materiTutorial?.tips || [""]);
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = () => {
    const finalCategory = isCustomCategory ? customCategory.trim() : matCategory.trim();

    if (!matTitle.trim() || !finalCategory) {
      showToast("Judul dan Kategori wajib diisi!");
      return;
    }

    // Map variables array back to object
    const variablesObj: { [key: string]: string } = {};
    matVariables.forEach(v => {
      if (v.key.trim()) {
        variablesObj[v.key.trim()] = v.value;
      }
    });

    const updatedMaterial: WorkflowItem = {
      id: editingMaterial ? editingMaterial.id : `wf-${Date.now()}`,
      category: finalCategory,
      isNew: !editingMaterial,
      isDraft: matIsDraft,
      isPublic: matIsPublic,
      title: matTitle.trim(),
      description: "",
      promptTemplate: matPromptTemplate,
      variables: variablesObj,
      materiTutorial: {
        overview: matOverview.trim(),
        steps: matSteps.filter(s => s.trim() !== ""),
        tips: matTips.filter(t => t.trim() !== ""),
        recommendedTools: []
      },
      duration: matDuration.trim(),
      youtubeUrl: matYoutubeUrl.trim(),
      geminiToolUrl: matGeminiToolUrl.trim()
    };

    let newWorkflows: WorkflowItem[] = [];
    if (editingMaterial) {
      newWorkflows = workflows.map(w => w.id === editingMaterial.id ? updatedMaterial : w);
      showToast("Materi berhasil diperbarui!");
      // Sync the live preview component if it's the edited material
      if (selectedMateriItem && selectedMateriItem.id === editingMaterial.id) {
        setSelectedMateriItem(updatedMaterial);
      }
    } else {
      newWorkflows = [updatedMaterial, ...workflows];
      showToast("Materi baru berhasil ditambahkan!");
    }

    setWorkflows(newWorkflows);
    localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));

    // Save to Supabase
    supabase.from("workflows").upsert({
      id: updatedMaterial.id,
      category: updatedMaterial.category,
      is_new: updatedMaterial.isNew,
      is_draft: matIsDraft,
      is_public: matIsPublic,
      title: updatedMaterial.title,
      description: updatedMaterial.description,
      prompt_template: updatedMaterial.promptTemplate,
      variables: updatedMaterial.variables,
      materi_tutorial: {
        ...updatedMaterial.materiTutorial,
        is_draft: matIsDraft,
        is_public: matIsPublic
      },
      duration: updatedMaterial.duration,
      youtube_url: updatedMaterial.youtubeUrl || null,
      gemini_tool_url: updatedMaterial.geminiToolUrl || null,
      roadmap: updatedMaterial.roadmap || []
    }).then(({ error }) => {
      if (error) console.error("Error upserting workflow to Supabase:", error);
    });

    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Materi",
      message: `Apakah Anda yakin ingin menghapus materi "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: () => {
        const newWorkflows = workflows.filter(w => w.id !== id);
        setWorkflows(newWorkflows);
        localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));

        // Delete from Supabase
        supabase.from("workflows").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Error deleting workflow from Supabase:", error);
        });

        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast("Materi berhasil dihapus!");
      }
    });
  };

  const handleTogglePublish = (item: WorkflowItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDraftStatus = !item.isDraft;
    
    const updatedMaterial: WorkflowItem = {
      ...item,
      isDraft: newDraftStatus
    };

    const newWorkflows = workflows.map(w => w.id === item.id ? updatedMaterial : w);
    setWorkflows(newWorkflows);
    localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));

    // Save to Supabase
    supabase.from("workflows").upsert({
      id: updatedMaterial.id,
      category: updatedMaterial.category,
      is_new: updatedMaterial.isNew,
      is_draft: newDraftStatus,
      is_public: item.isPublic ?? false,
      title: updatedMaterial.title,
      description: updatedMaterial.description,
      prompt_template: updatedMaterial.promptTemplate,
      variables: updatedMaterial.variables,
      materi_tutorial: {
        ...updatedMaterial.materiTutorial,
        is_draft: newDraftStatus,
        is_public: item.isPublic ?? false
      },
      duration: updatedMaterial.duration,
      youtube_url: updatedMaterial.youtubeUrl || null,
      gemini_tool_url: updatedMaterial.geminiToolUrl || null,
      roadmap: updatedMaterial.roadmap || []
    }).then(({ error }) => {
      if (error) {
        console.error("Error toggling publish status in Supabase:", error);
        showToast("Gagal memperbarui status publikasi.");
      } else {
        showToast(newDraftStatus ? "Materi berhasil diubah ke Draft!" : "Materi berhasil dipublish (Live)!");
        // Sync the live preview if selected
        if (selectedMateriItem && selectedMateriItem.id === item.id) {
          setSelectedMateriItem(updatedMaterial);
        }
      }
    });
  };

  const handleTogglePublic = (item: WorkflowItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPublicStatus = !item.isPublic;
    
    const updatedMaterial: WorkflowItem = {
      ...item,
      isPublic: newPublicStatus
    };

    const newWorkflows = workflows.map(w => w.id === item.id ? updatedMaterial : w);
    setWorkflows(newWorkflows);
    localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));

    // Save to Supabase
    supabase.from("workflows").upsert({
      id: updatedMaterial.id,
      category: updatedMaterial.category,
      is_new: updatedMaterial.isNew,
      is_draft: item.isDraft ?? false,
      is_public: newPublicStatus,
      title: updatedMaterial.title,
      description: updatedMaterial.description,
      prompt_template: updatedMaterial.promptTemplate,
      variables: updatedMaterial.variables,
      materi_tutorial: {
        ...updatedMaterial.materiTutorial,
        is_draft: item.isDraft ?? false,
        is_public: newPublicStatus
      },
      duration: updatedMaterial.duration,
      youtube_url: updatedMaterial.youtubeUrl || null,
      gemini_tool_url: updatedMaterial.geminiToolUrl || null,
      roadmap: updatedMaterial.roadmap || []
    }).then(({ error }) => {
      if (error) {
        console.error("Error toggling public status in Supabase:", error);
        showToast("Gagal memperbarui status akses publik.");
      } else {
        showToast(newPublicStatus ? "Materi sekarang TERBUKA untuk publik! 🔓" : "Materi sekarang TERKUNCI untuk publik! 🔒");
        // Sync the live preview if selected
        if (selectedMateriItem && selectedMateriItem.id === item.id) {
          setSelectedMateriItem(updatedMaterial);
        }
      }
    });
  };

  const handleSaveChangesToDatabase = async () => {
    if (!selectedMateriItem) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("workflows").upsert({
        id: selectedMateriItem.id,
        category: selectedMateriItem.category,
        is_new: selectedMateriItem.isNew,
        title: selectedMateriItem.title,
        description: selectedMateriItem.description || "",
        prompt_template: selectedMateriItem.promptTemplate || "",
        variables: selectedMateriItem.variables || {},
        materi_tutorial: selectedMateriItem.materiTutorial || {},
        duration: selectedMateriItem.duration || "",
        youtube_url: selectedMateriItem.youtubeUrl || null,
        gemini_tool_url: selectedMateriItem.geminiToolUrl || null,
        roadmap: selectedMateriItem.roadmap || []
      });
      if (error) {
        console.error("Error upserting workflow to Supabase:", error);
        showToast("Gagal menyimpan perubahan ke database!");
      } else {
        setHasUnsavedChanges(false);
        showToast("Perubahan berhasil disimpan ke database! 🎉");
      }
    } catch (err) {
      console.error("Error upserting to Supabase:", err);
      showToast("Gagal menyimpan perubahan ke database!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPromptModal = (item: WorkflowItem) => {
    setSelectedPromptItem(item);
    setPromptVariables({ ...item.variables });
  };

  const handleVariableChange = (key: string, value: string) => {
    setPromptVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getCompiledPrompt = (item: WorkflowItem) => {
    let text = item.promptTemplate;
    Object.entries(promptVariables).forEach(([key, val]) => {
      text = text.replaceAll(`[${key}]`, (val as string) || `[${key}]`);
    });
    return text;
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "success" | "warning" | "danger" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Ya, Yakin",
    cancelText: "Batal",
    variant: "info",
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



  const executeVerifyMember = async (id: string) => {
    const targetMember = members.find(m => m.id === id);
    if (!targetMember) return;

    try {
      const { error } = await supabase.from("members").update({ status: "Aktif" }).eq("id", id);
      if (error) throw error;

      showToast(`Akun ${targetMember.username || targetMember.name} berhasil diaktifkan!`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal memverifikasi: ${err.message || err}`);
    }
  };

  const executeDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;

      showToast("Anggota berhasil dihapus.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menghapus: ${err.message || err}`);
    }
  };

  const executeApprovePayout = async (id: string) => {
    const targetPayout = payouts.find(p => p.id === id);
    if (!targetPayout) {
      showToast("Payout tidak ditemukan.");
      return;
    }

    try {
      const { error } = await supabase.from("payouts").update({ status: "Selesai" }).eq("id", id);
      if (error) throw error;

      // Find the requesting member to get their phone number
      const requesterMember = members.find(
        m => (m.promoCode && m.promoCode.toUpperCase() === targetPayout.refCode.toUpperCase()) ||
             (m.name && m.name.toLowerCase() === targetPayout.memberName.toLowerCase()) ||
             (m.username && m.username.toLowerCase() === targetPayout.memberName.toLowerCase())
      );

      const memberPhone = requesterMember ? requesterMember.phone : "";

      showToast("Permintaan pencairan komisi disetujui! Mengalihkan ke WhatsApp member... 🎉");
      fetchData();

      if (memberPhone) {
        let cleanedPhone = memberPhone.replace(/[^0-9]/g, "");
        if (cleanedPhone.startsWith("0")) {
          cleanedPhone = "62" + cleanedPhone.slice(1);
        }

        const waText = `Halo *${targetPayout.walletOwner || targetPayout.memberName}*, kami dari Admin *insAIght Kendari* ingin menginformasikan bahwa pengajuan pencairan komisi Anda sebesar *Rp ${targetPayout.amount.toLocaleString("id-ID")}* telah disetujui dan dicairkan. 🎉

*Detail Pengiriman:*
• Metode: *${targetPayout.walletType}*
• No Rekening/E-Wallet: *${targetPayout.walletNumber}*
• Atas Nama: *${targetPayout.walletOwner}*

Mohon dicek kembali apakah dananya sudah masuk ke rekening/e-wallet Anda ya. Terima kasih atas kontribusinya! 🙏🚀`;

        setTimeout(() => {
          window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(waText)}`, "_blank");
        }, 1500);
      } else {
        console.warn("No phone number found for member:", targetPayout.memberName);
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menyetujui payout: ${err.message || err}`);
    }
  };

  const executeRejectPayout = async (id: string) => {
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

  const executeDeletePayout = async (id: string) => {
    try {
      const { error } = await supabase.from("payouts").delete().eq("id", id);
      if (error) throw error;

      showToast("Log payout dihapus.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menghapus log payout: ${err.message || err}`);
    }
  };

  // Trigger modal handlers
  const triggerVerifyMember = (id: string, username: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Verifikasi & Aktifkan Member",
      message: `Apakah Anda yakin ingin menyetujui dan mengaktifkan member "${username}"? Status member akan diubah menjadi Aktif (Lunas).`,
      onConfirm: () => {
        executeVerifyMember(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: "Ya, Aktifkan",
      cancelText: "Batal",
      variant: "success"
    });
  };

  const triggerDeleteMember = (id: string, username: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Anggota",
      message: `Apakah Anda yakin ingin menghapus data anggota "${username}"? Tindakan ini permanen dan tidak dapat dibatalkan.`,
      onConfirm: () => {
        executeDeleteMember(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger"
    });
  };

  const triggerApprovePayout = (id: string, memberName: string, amount: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Setujui Pencairan Komisi",
      message: `Apakah Anda yakin ingin menyetujui permintaan pencairan komisi untuk "${memberName}" sebesar Rp ${amount.toLocaleString("id-ID")}? Status pencairan akan diubah menjadi Selesai.`,
      onConfirm: () => {
        executeApprovePayout(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: "Ya, Setujui & Cairkan",
      cancelText: "Batal",
      variant: "success"
    });
  };

  const triggerRejectPayout = (id: string, memberName: string, amount: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Tolak Pencairan Komisi",
      message: `Apakah Anda yakin ingin menolak permintaan pencairan komisi untuk "${memberName}" sebesar Rp ${amount.toLocaleString("id-ID")}? Status pencairan akan diubah menjadi Ditolak.`,
      onConfirm: () => {
        executeRejectPayout(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: "Ya, Tolak",
      cancelText: "Batal",
      variant: "danger"
    });
  };

  const triggerDeletePayout = (id: string, memberName: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Log Payout",
      message: `Apakah Anda yakin ingin menghapus catatan log payout untuk "${memberName}"?`,
      onConfirm: () => {
        executeDeletePayout(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: "Ya, Hapus Log",
      cancelText: "Batal",
      variant: "danger"
    });
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
      (m.username || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
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
    <div className="relative min-h-screen bg-[#e2e8f0] text-slate-700 pt-24 pb-20 px-4 sm:px-6 lg:px-8 z-10 selection:bg-slate-900/10 selection:text-slate-800">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-[#e2e8f0] shadow-neu-flat text-slate-950 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-bounce">
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
                <span className="text-xs font-bold text-slate-800 bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded-full border-0 uppercase tracking-wider">
                  Panel Administrator
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
                Manajemen Anggota & Komisi
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 self-start sm:self-auto">
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
              <Users className="w-4 h-4 text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-800">{members.length}</div>
            <span className="text-[10px] text-slate-400 font-bold">Anggota Komunitas</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Komisi Cair (Lunas)</span>
              <DollarSign className="w-4 h-4 text-slate-800" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              Rp {totalCommisionsPaid.toLocaleString("id-ID")}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Telah dikirim ke Wallet</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Komisi Pending</span>
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-700">
              Rp {totalCommissionsPending.toLocaleString("id-ID")}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Menunggu Verifikasi Admin</span>
          </div>

          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-4 border-0">
            <div className="text-xs text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Rata-rata Konversi</span>
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-2xl font-black text-slate-800">
              {members.length > 0 ? ((members.filter(m => m.referredBy !== "-").length / members.length) * 100).toFixed(0) : 0}%
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Melalui Jalur Referral</span>
          </div>
        </div>



        {/* Navigation Tabs for Administrator */}
        <div className="flex bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-1.5 border-0 justify-around max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveAdminTab("members");
              setSearchQuery("");
            }}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === "members"
                ? "shadow-neu-inset text-slate-950 bg-[#e2e8f0]"
                : "text-slate-500 hover:text-slate-800 bg-transparent"
            }`}
          >
            <Users className="w-4 h-4" />
            Manajemen Member
          </button>
          <button
            onClick={() => {
              setActiveAdminTab("materials");
              setSearchQuery("");
            }}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === "materials"
                ? "shadow-neu-inset text-slate-950 bg-[#e2e8f0]"
                : "text-slate-500 hover:text-slate-800 bg-transparent"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Manajemen Materi ({workflows.length})
          </button>
        </div>

        {activeAdminTab === "members" ? (
          <>
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
                            ? "shadow-neu-inset text-slate-950 bg-[#e2e8f0]"
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
                            ? "shadow-neu-inset text-slate-950 bg-[#e2e8f0]"
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
                    <Users className="w-5 h-5 text-slate-800" />
                    <span>Seluruh Anggota Komunitas ({filteredMembers.length})</span>
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-[#e2e8f0]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#e2e8f0]/40 border-b border-slate-300 text-xs text-slate-500 uppercase font-bold">
                        <th className="p-3.5">Username & Kontak</th>
                        <th className="p-3.5">Referred By</th>
                        <th className="p-3.5">Status Member</th>
                        <th className="p-3.5">Status Payout</th>
                        <th className="p-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 text-xs text-slate-600">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            Tidak ada anggota ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map(member => (
                          <tr key={member.id} className="hover:bg-[#e2e8f0]/60 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
                                <span>{member.username || member.name}</span>
                                <span className="text-[9px] font-mono font-bold text-slate-900 bg-slate-300 border border-slate-400/20 px-1 py-0.2 rounded">
                                  {member.promoCode}
                                </span>
                                {member.role === "admin" ? (
                                  <span className="text-[9px] font-bold text-slate-850 bg-slate-300 border border-slate-400/20 px-1 py-0.2 rounded">
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
                                  onClick={() => triggerVerifyMember(member.id, member.username || member.name || "Member")}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border bg-slate-300 hover:bg-slate-400 text-slate-800 hover:text-slate-950 border-slate-400/20 transition-all cursor-pointer shadow-sm hover:shadow"
                                  title="Klik untuk Aktifkan & Verifikasi Member"
                                >
                                  <span>●</span> {member.status} (Aktifkan)
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border bg-slate-200 text-slate-700 border-slate-300">
                                  <span>●</span> {member.status}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {(() => {
                                  const pStatus = getPayoutStatus(member);
                                  return (
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                      pStatus.text === "Cair" 
                                        ? "bg-slate-300 text-slate-850 border-slate-400/20"
                                        : pStatus.text === "Diajukan"
                                        ? "bg-slate-250 text-slate-700 border-slate-300"
                                        : pStatus.text === "Ditolak"
                                        ? "bg-slate-250 text-slate-400 border-slate-300/40 line-through"
                                        : "bg-slate-200 text-slate-500 border-slate-300"
                                    }`}>
                                      <span>●</span> {pStatus.text}
                                    </span>
                                  );
                              })()}
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => triggerDeleteMember(member.id, member.username || member.name || "Member")}
                                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                title="Hapus Member"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                  <DollarSign className="w-5 h-5 text-slate-800" />
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
                              ? "bg-slate-300 text-slate-850 border-slate-400/20"
                              : payout.status === "Menunggu"
                              ? "bg-slate-200 text-slate-600 border-slate-300"
                              : "bg-slate-250 text-slate-400 border-slate-300/40 line-through"
                          }`}>
                            {payout.status}
                          </span>
                        </div>

                        <div className="bg-[#e2e8f0] shadow-neu-inset rounded-lg p-2.5 space-y-1 font-mono text-[10px] text-slate-600 border-0">
                          <div><strong className="text-slate-400">Tujuan:</strong> {payout.walletType}</div>
                          <div><strong className="text-slate-400">No/ID:</strong> {payout.walletNumber}</div>
                          <div><strong className="text-slate-400">A/N:</strong> {payout.walletOwner}</div>
                          <div className="text-right text-xs font-black text-slate-900 mt-1.5 pt-1 border-t border-slate-300">
                            Rp {payout.amount.toLocaleString("id-ID")}
                          </div>
                        </div>

                        {payout.status === "Menunggu" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => triggerApprovePayout(payout.id, payout.memberName, payout.amount)}
                              className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui (Lunas)</span>
                            </button>
                            <button
                              onClick={() => triggerRejectPayout(payout.id, payout.memberName, payout.amount)}
                              className="px-2.5 py-1.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-600 hover:text-red-600 text-[10px] font-bold rounded-lg flex items-center justify-center transition-all border-0 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {payout.status !== "Menunggu" && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => triggerDeletePayout(payout.id, payout.memberName)}
                              className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 font-bold cursor-pointer"
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
          </>
        ) : selectedMateriItem ? (
          /* High Fidelity Live Preview of CoursePageView for Admin */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-4 border border-slate-300 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider font-mono">
                  🔍 MODE PRATINJAU MATERI (LIVE PREVIEW)
                </span>
                {hasUnsavedChanges ? (
                  <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-lg font-mono tracking-wider w-fit animate-pulse">
                    ⚠️ ADA PERUBAHAN BELUM DISIMPAN
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-lg font-mono tracking-wider w-fit">
                    ✅ SEMUA PERUBAHAN TERSIMPAN
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveChangesToDatabase}
                  disabled={isSaving}
                  className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border-0 cursor-pointer ${
                    hasUnsavedChanges
                      ? "bg-indigo-600 hover:bg-indigo-700 animate-pulse"
                      : "bg-indigo-600/50 cursor-not-allowed opacity-80"
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan ke Database"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      if (window.confirm("Ada perubahan pada materi yang belum disimpan ke database. Apakah Anda yakin ingin kembali tanpa menyimpan?")) {
                        setSelectedMateriItem(null);
                        setHasUnsavedChanges(false);
                      }
                    } else {
                      setSelectedMateriItem(null);
                    }
                  }}
                  className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 border-0 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Manajemen Materi</span>
                </button>
              </div>
            </div>
            
            <CoursePageView 
              item={selectedMateriItem} 
              onBack={() => {
                if (hasUnsavedChanges) {
                  if (window.confirm("Ada perubahan pada materi yang belum disimpan ke database. Apakah Anda yakin ingin kembali tanpa menyimpan?")) {
                    setSelectedMateriItem(null);
                    setHasUnsavedChanges(false);
                  }
                } else {
                  setSelectedMateriItem(null);
                }
              }} 
              memberName="Admin"
              onOpenPrompt={handleOpenPromptModal}
              onEdit={handleOpenEditMaterial}
              onPlayVideo={(item) => setActiveTutorialVideoItem(item)}
              onUpdateItem={(updatedItem) => {
                setSelectedMateriItem(updatedItem);
                const newWorkflows = workflows.map(w => w.id === updatedItem.id ? updatedItem : w);
                setWorkflows(newWorkflows);
                localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));
                setHasUnsavedChanges(true);
              }}
            />
          </div>
        ) : (
          /* Materials Management Section */
          <div className="space-y-6">
            {/* Header / Search & Add Tool Bar */}
            <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">
                      ADMIN PROMPT AUTOMATION PORTAL
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-slate-900 animate-spin-slow" />
                    <span>MANAJEMEN WORKFLOWS & MATERI</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Atur koleksi premium berisi framework prompt profesional, materi panduan, dan langkah-langkah praktis kolaborasi dengan kecerdasan buatan di bawah ini.
                  </p>
                </div>

                <button 
                  type="button"
                  onClick={handleOpenAddMaterial}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1.5 border-0 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Materi Baru</span>
                </button>
              </div>

              {/* SEARCH BAR & CATEGORY FILTER */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 border-t border-slate-300">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari tool atau kata kunci prompt..."
                    className="w-full bg-[#e2e8f0] shadow-neu-inset rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset-sm transition-all border-0"
                  />
                  <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none">
                    <Search className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Minimalist Dropdown Category Filter */}
                <div className="relative sm:w-64 shrink-0">
                  <select
                    value={activeAdminCategory}
                    onChange={(e) => setActiveAdminCategory(e.target.value)}
                    className="w-full bg-[#e2e8f0] shadow-neu-flat text-slate-800 font-extrabold text-xs px-4 py-3 rounded-2xl focus:outline-none focus:shadow-neu-inset-sm border-0 cursor-pointer appearance-none transition-all pr-10"
                    id="admin-workflow-category-select"
                  >
                    {["Semua Kategori", ...allCategories].map((cat) => {
                      const count = cat === "Semua Kategori"
                        ? workflows.length
                        : workflows.filter(item => item.category === cat).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-3.5 text-slate-500 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* CARDS LIST GRID (Exactly matching member portal layout: 4 cols) */}
            {loadingWorkflows ? (
              <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto animate-spin" />
                <h4 className="font-extrabold text-slate-800">Memuat Materi...</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Menghubungkan ke Supabase untuk mengambil data materi terbaru.
                </p>
              </div>
            ) : workflows.filter(item => {
              const matchesCategory = activeAdminCategory === "Semua Kategori" || item.category === activeAdminCategory;
              const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
              return matchesCategory && matchesSearch;
            }).length === 0 ? (
              <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <Search className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                <h4 className="font-extrabold text-slate-800">Tidak Ada Hasil Ditemukan</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Kami tidak menemukan kecocokan untuk kata kunci "{searchQuery}" di kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" id="admin-workflow-cards-grid">
                {workflows
                  .filter(item => {
                    const matchesCategory = activeAdminCategory === "Semua Kategori" || item.category === activeAdminCategory;
                    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
                    return matchesCategory && matchesSearch;
                  })
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 flex flex-col justify-between relative hover:shadow-neu-flat-lg hover:scale-[1.01] transition-all border border-[#ffffff]/40 cursor-pointer"
                      onClick={() => setSelectedMateriItem(item)}
                    >
                      {/* Top Meta info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] font-extrabold text-slate-500 bg-[#e2e8f0] shadow-neu-inset-sm rounded-md px-2 py-0.5 uppercase tracking-wider font-mono">
                            {item.category}
                          </span>
                          {item.isDraft ? (
                            <span className="text-[9px] font-bold bg-[#e2e8f0] shadow-neu-inset-sm text-slate-500 px-1.5 py-0.5 rounded-md uppercase font-mono">
                              DRAFT
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold bg-[#0f172a] text-white px-1.5 py-0.5 rounded-md uppercase font-mono">
                              LIVE
                            </span>
                          )}
                          {item.isPublic ? (
                            <span className="text-[9px] font-bold bg-slate-300/45 text-slate-700 px-1.5 py-0.5 rounded-md uppercase font-mono flex items-center gap-0.5" title="Terbuka untuk Publik">
                              <Unlock className="w-2.5 h-2.5" />
                              PUB
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold bg-slate-300/45 text-slate-600 px-1.5 py-0.5 rounded-md uppercase font-mono flex items-center gap-0.5" title="Terkunci (Butuh Login)">
                              <Lock className="w-2.5 h-2.5" />
                              LCK
                            </span>
                          )}
                        </div>
                        {item.isNew && (
                          <span className="text-[9px] font-black bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full tracking-widest shadow-sm uppercase font-mono animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Main Content Info */}
                      <div className="space-y-2 flex-1 text-left">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight uppercase font-sans">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons Stacking Area */}
                      <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-300">
                        {/* Row 1: Buka Tool (Main CTA) & Quick link icon */}
                        <div className="flex items-center gap-2">
                          <a
                            href={item.geminiToolUrl || "https://gemini.google.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2.5 px-4 bg-lime-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:bg-lime-500 active:scale-95 transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer no-underline text-center"
                            title="Buka Tool"
                          >
                            <span>Buka Tool</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPrompt(item.id, item.promptTemplate);
                            }}
                            className="p-2.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-700 hover:text-slate-900 rounded-xl transition-all shrink-0 flex items-center justify-center border-0 cursor-pointer"
                            title="Salin Prompt Mentah"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4.5 h-4.5 text-green-600" />
                            ) : (
                              <Copy className="w-4.5 h-4.5" />
                            )}
                          </button>
                        </div>

                        {/* Row 2: Buka Tutorial (Secondary CTA) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTutorialVideoItem(item);
                          }}
                          className="w-full py-2.5 px-4 bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                          title="Buka Video Tutorial YouTube"
                        >
                          <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          <span>Buka Tutorial</span>
                        </button>

                        {/* Bottom Stats Meta */}
                        {item.duration && (
                          <div className="flex items-center justify-end text-[10px] text-slate-500 font-mono font-semibold pt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Admin Operations Section (Hapus & Publish/Draft & Publik) */}
                      <div className="flex gap-2 pt-3.5 mt-3 border-t border-slate-300">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMaterial(item.id, item.title);
                          }}
                          className="flex-1 py-2 px-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset hover:text-red-600 text-slate-600 font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border-0 uppercase tracking-wider font-sans"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleTogglePublish(item, e)}
                          className={`flex-1 py-2 px-2 font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border-0 uppercase tracking-wider font-sans ${
                            item.isDraft
                              ? "bg-[#e2e8f0] shadow-neu-flat hover:shadow-[#ffffff]/60 text-slate-600 hover:text-indigo-650"
                              : "bg-[#e2e8f0] shadow-neu-inset-sm text-indigo-600 hover:text-slate-800"
                          }`}
                          title={item.isDraft ? "Publish (Jadikan Live)" : "Ubah ke Draft (Sembunyikan)"}
                        >
                          {item.isDraft ? (
                            <>
                              <Globe className="w-3.5 h-3.5" />
                              <span>Publish</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleTogglePublic(item, e)}
                          className={`flex-1 py-2 px-2 font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border-0 uppercase tracking-wider font-sans ${
                            item.isPublic
                              ? "bg-[#e2e8f0] shadow-neu-inset-sm text-indigo-600 hover:text-slate-800"
                              : "bg-[#e2e8f0] shadow-neu-flat hover:shadow-[#ffffff]/60 text-slate-600 hover:text-indigo-650"
                          }`}
                          title={item.isPublic ? "Kunci dari Publik (Butuh Login)" : "Buka untuk Publik (Tanpa Login)"}
                        >
                          {item.isPublic ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Kunci</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Publik</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Materials Edit / Add Modal */}
      <AnimatePresence>
        {isMaterialModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 max-w-2xl w-full border-0 space-y-6 my-8 text-slate-800 relative"
            >
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>{editingMaterial ? "Edit Materi Pembelajaran" : "Tambah Materi Baru"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Atur detail materi, prompt template, variabel kustom, dan langkah-langkah tutorial.
                </p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-left">
                {/* Kategori Materi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Kategori Materi</label>
                  <select
                    value={isCustomCategory ? "__CUSTOM__" : matCategory}
                    onChange={e => {
                      if (e.target.value === "__CUSTOM__") {
                        setIsCustomCategory(true);
                        setCustomCategory("");
                      } else {
                        setIsCustomCategory(false);
                        setMatCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold"
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__CUSTOM__" className="text-indigo-600 font-bold">+ Buat Kategori Baru...</option>
                  </select>

                  {isCustomCategory && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 space-y-1"
                    >
                      <label className="text-[10px] font-bold text-indigo-600">Nama Kategori Baru</label>
                      <input
                        type="text"
                        placeholder="Tulis kategori baru di sini..."
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Status Publikasi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Status Publikasi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMatIsDraft(true)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border-0 cursor-pointer ${
                        matIsDraft
                          ? "bg-amber-400 text-slate-950 shadow-neu-inset font-black scale-[1.01]"
                          : "bg-[#e2e8f0] shadow-neu-flat text-slate-500 hover:text-slate-800 hover:shadow-neu-inset-sm"
                      }`}
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Draft (Sembunyikan)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatIsDraft(false)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border-0 cursor-pointer ${
                        !matIsDraft
                          ? "bg-lime-400 text-slate-950 shadow-neu-inset font-black scale-[1.01]"
                          : "bg-[#e2e8f0] shadow-[#94a3b8]/20 text-slate-500 hover:text-slate-800 hover:shadow-neu-inset-sm"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Publish (Live)</span>
                    </button>
                  </div>
                </div>

                {/* Akses Publik (Tanpa Login) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Akses Publik (Tanpa Login)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMatIsPublic(false)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border-0 cursor-pointer ${
                        !matIsPublic
                          ? "bg-red-400 text-white shadow-neu-inset font-black scale-[1.01]"
                          : "bg-[#e2e8f0] shadow-neu-flat text-slate-500 hover:text-slate-800 hover:shadow-neu-inset-sm"
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Terkunci (Butuh Login)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatIsPublic(true)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border-0 cursor-pointer ${
                        matIsPublic
                          ? "bg-emerald-400 text-slate-950 shadow-neu-inset font-black scale-[1.01]"
                          : "bg-[#e2e8f0] shadow-[#94a3b8]/20 text-slate-500 hover:text-slate-800 hover:shadow-neu-inset-sm"
                      }`}
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Terbuka (Akses Publik)</span>
                    </button>
                  </div>
                </div>

                {/* Judul */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Judul Materi</label>
                  <input
                    type="text"
                    placeholder="Contoh: FISHING SHORTS AI"
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold"
                  />
                </div>

                {/* URLs: Youtube & Gemini */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">URL Embed YouTube Tutorial</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://www.youtube.com/embed/P72E81UatE8"
                      value={matYoutubeUrl}
                      onChange={e => setMatYoutubeUrl(e.target.value)}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">URL Tools / Custom Prompt Link</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://gemini.google.com"
                      value={matGeminiToolUrl}
                      onChange={e => setMatGeminiToolUrl(e.target.value)}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0"
                    />
                  </div>
                </div>

                {/* Prompt Template */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex justify-between">
                    <span>Template Prompt (Gunakan kurung siku [Variabel] untuk variabel dinamis)</span>
                  </label>
                  <textarea
                    placeholder="Contoh: Saya ingin membuat naskah video pendek bertema [Topik]..."
                    value={matPromptTemplate}
                    rows={4}
                    onChange={e => setMatPromptTemplate(e.target.value)}
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:shadow-neu-inset border-0"
                  />
                </div>

                {/* Ringkasan / Overview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Ringkasan / Overview</label>
                  <textarea
                    placeholder="Tulis ringkasan singkat materi..."
                    value={matOverview}
                    rows={2}
                    onChange={e => setMatOverview(e.target.value)}
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold"
                  />
                </div>

                {/* Variabel Kustom */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-700">Variabel Dinamis</label>
                    <button
                      type="button"
                      onClick={() => setMatVariables([...matVariables, { key: "", value: "" }])}
                      className="text-[10px] font-extrabold text-indigo-600 hover:underline flex items-center gap-1 border-0 bg-transparent cursor-pointer font-sans"
                    >
                      <Plus className="w-3 h-3" /> Tambah Variabel
                    </button>
                  </div>
                  {matVariables.map((v, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Nama Variabel"
                        value={v.key}
                        onChange={e => {
                          const updated = [...matVariables];
                          updated[idx].key = e.target.value;
                          setMatVariables(updated);
                        }}
                        className="flex-1 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-3 py-2 text-[11px] text-slate-800 focus:outline-none border-0 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Nilai Default"
                        value={v.value}
                        onChange={e => {
                          const updated = [...matVariables];
                          updated[idx].value = e.target.value;
                          setMatVariables(updated);
                        }}
                        className="flex-2 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-3 py-2 text-[11px] text-slate-800 focus:outline-none border-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          showConfirm(
                            "Hapus Variabel?",
                            `Apakah Anda yakin ingin menghapus variabel "${v.key || "baru"}"?`,
                            () => {
                              const updated = matVariables.filter((_, i) => i !== idx);
                              setMatVariables(updated);
                            }
                          );
                        }}
                        className="p-2 text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer"
                        title="Hapus variabel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Langkah-Langkah Tutorial */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-700">Langkah-Langkah Tutorial</label>
                    <button
                      type="button"
                      onClick={() => setMatSteps([...matSteps, ""])}
                      className="text-[10px] font-extrabold text-indigo-600 hover:underline flex items-center gap-1 border-0 bg-transparent cursor-pointer font-sans"
                    >
                      <Plus className="w-3 h-3" /> Tambah Langkah
                    </button>
                  </div>
                  {matSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-400 font-mono w-5 shrink-0 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder={`Langkah ke-${idx + 1}...`}
                        value={step}
                        onChange={e => {
                          const updated = [...matSteps];
                          updated[idx] = e.target.value;
                          setMatSteps(updated);
                        }}
                        className="flex-1 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-3 py-2 text-[11px] text-slate-800 focus:outline-none border-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          showConfirm(
                            "Hapus Langkah Tutorial?",
                            `Apakah Anda yakin ingin menghapus langkah tutorial ke-${idx + 1}?`,
                            () => {
                              const updated = matSteps.filter((_, i) => i !== idx);
                              setMatSteps(updated);
                            }
                          );
                        }}
                        className="p-2 text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer"
                        title="Hapus langkah"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tips Tambahan */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-700">Tips Tambahan</label>
                    <button
                      type="button"
                      onClick={() => setMatTips([...matTips, ""])}
                      className="text-[10px] font-extrabold text-indigo-600 hover:underline flex items-center gap-1 border-0 bg-transparent cursor-pointer font-sans"
                    >
                      <Plus className="w-3 h-3" /> Tambah Tips
                    </button>
                  </div>
                  {matTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-400 font-mono w-5 shrink-0 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder={`Tips ke-${idx + 1}...`}
                        value={tip}
                        onChange={e => {
                          const updated = [...matTips];
                          updated[idx] = e.target.value;
                          setMatTips(updated);
                        }}
                        className="flex-1 bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-3 py-2 text-[11px] text-slate-800 focus:outline-none border-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          showConfirm(
                            "Hapus Tips Tambahan?",
                            `Apakah Anda yakin ingin menghapus tips ke-${idx + 1}?`,
                            () => {
                              const updated = matTips.filter((_, i) => i !== idx);
                              setMatTips(updated);
                            }
                          );
                        }}
                        className="p-2 text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer"
                        title="Hapus tips"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-300">
                {editingMaterial && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMaterialModalOpen(false);
                      handleDeleteMaterial(editingMaterial.id, editingMaterial.title);
                    }}
                    className="py-3 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 text-xs font-extrabold transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                    title="Hapus seluruh materi ini"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Materi</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#e2e8f0] shadow-neu-flat text-slate-600 hover:shadow-neu-inset text-xs font-bold transition-all border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveMaterial}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
                >
                  {editingMaterial ? "Simpan Perubahan" : "Tambah Materi"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simplified Add Material Modal */}
      <AnimatePresence>
        {isAddMaterialModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 max-w-md w-full border-0 space-y-6 text-slate-800 relative text-left"
            >
              <button
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Tambah Materi Baru</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Masukkan judul materi di bawah ini untuk membuat kartu materi secara instan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Judul Materi</label>
                  <input
                    type="text"
                    placeholder="Contoh: FISHING SHORTS AI"
                    value={newMaterialTitle}
                    onChange={(e) => setNewMaterialTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateNewMaterial();
                      }
                    }}
                    autoFocus
                    className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat text-slate-600 hover:shadow-neu-inset text-xs font-bold transition-all border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewMaterial}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
                >
                  Buat Materi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 max-w-sm w-full border-0 space-y-4 text-center text-slate-800"
            >
              <div className="flex justify-center">
                <div className={`p-3 rounded-full shadow-neu-inset ${
                  confirmModal.variant === "success" 
                    ? "text-emerald-600 bg-emerald-50" 
                    : confirmModal.variant === "danger" 
                    ? "text-red-500 bg-red-50" 
                    : "text-indigo-600 bg-indigo-50"
                }`}>
                  <AlertCircle className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-base font-black tracking-tight text-slate-800">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat text-slate-600 hover:shadow-neu-inset text-xs font-bold transition-all border-0 cursor-pointer"
                >
                  {confirmModal.cancelText || "Batal"}
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-extrabold transition-all shadow-md cursor-pointer hover:opacity-90 ${
                    confirmModal.variant === "success"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                      : confirmModal.variant === "danger"
                      ? "bg-red-600 hover:bg-red-700 shadow-red-600/10"
                      : "bg-slate-800 hover:bg-slate-700 shadow-slate-800/10"
                  }`}
                >
                  {confirmModal.confirmText || "Ya, Yakin"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: BUKA TOOL (INTERACTIVE PROMPT BUILDER OVERLAY FOR ADMIN) */}
        {selectedPromptItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setSelectedPromptItem(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#e2e8f0] shadow-neu-flat-lg rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col relative border border-[#ffffff]/60 z-10"
              id="admin-prompt-builder-modal"
            >
              <div className="p-6 border-b border-slate-300 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-black text-slate-500 font-mono bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedPromptItem.category} • TOOL BUILDER
                  </span>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    {selectedPromptItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPromptItem(null)}
                  className="p-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset rounded-xl text-slate-500 hover:text-slate-800 transition-all border-0 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="p-4 bg-slate-200 border border-slate-350/10 rounded-2xl space-y-1 text-left">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-lime-600 animate-pulse" />
                    <span>Cara Penggunaan:</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ubah nilai isian parameter pada form di bawah ini. Teks prompt premium akan tersusun secara dinamis dan siap disalin untuk diserahkan ke ChatGPT, Claude, atau Gemini Anda.
                  </p>
                </div>

                {selectedPromptItem.variables && Object.keys(selectedPromptItem.variables).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono text-left">
                      1. Atur Parameter Variabel
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(selectedPromptItem.variables).map(([key, defaultValue]) => (
                        <div key={key} className="space-y-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700">{key}</label>
                          <input
                            type="text"
                            value={promptVariables[key] === undefined ? defaultValue : promptVariables[key]}
                            onChange={(e) => handleVariableChange(key, e.target.value)}
                            placeholder={`Isikan ${key}...`}
                            className="w-full bg-[#e2e8f0] shadow-neu-inset rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset-sm border-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      2. Salin Prompt Premium
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(selectedPromptItem.id, getCompiledPrompt(selectedPromptItem))}
                      className="px-3.5 py-1.5 bg-lime-400 hover:bg-lime-500 text-slate-950 font-extrabold text-[10px] rounded-lg shadow-sm flex items-center gap-1 border-0 cursor-pointer transition-all"
                    >
                      {copiedId === selectedPromptItem.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Berhasil Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-[#e2e8f0] shadow-neu-inset rounded-2xl p-4 relative border border-slate-300">
                    <pre className="text-[11px] font-mono text-slate-700 leading-relaxed whitespace-pre-wrap text-left break-all max-h-60 overflow-y-auto">
                      {getCompiledPrompt(selectedPromptItem)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-200 border-t border-slate-300 text-center text-[10px] text-slate-500 font-bold">
                * Gunakan prompt ini dengan GPT-4o, Gemini 1.5 Pro, atau Claude 3.5 Sonnet untuk hasil terbaik.
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: YOUTUBE VIDEO TUTORIAL POPUP FOR ADMIN */}
        {activeTutorialVideoItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setActiveTutorialVideoItem(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#e2e8f0] shadow-neu-flat-lg rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative border border-[#ffffff]/60 z-10"
              id="admin-youtube-tutorial-modal"
            >
              <div className="p-6 border-b border-slate-300 flex items-center justify-between bg-slate-200/50">
                <div className="space-y-1 text-left bg-transparent">
                  <span className="text-[10px] font-black text-red-650 font-mono bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {activeTutorialVideoItem.category} • VIDEO TUTORIAL
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    {activeTutorialVideoItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTutorialVideoItem(null)}
                  className="p-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset rounded-xl text-slate-500 hover:text-slate-800 transition-all border-0 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-neu-inset bg-slate-950">
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src={`${getYoutubeEmbedUrl(activeTutorialVideoItem.youtubeUrl)}?autoplay=1`}
                    title={`Video Tutorial ${activeTutorialVideoItem.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="space-y-2 text-left bg-slate-200/40 shadow-neu-inset-sm p-4 rounded-2xl border border-slate-300">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-lime-650" />
                    <span>Mengenai Tutorial Ini:</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeTutorialVideoItem.description}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-1 font-mono">
                    * Klik di luar modal ini atau tekan tombol silang untuk menutup dan menghentikan pemutaran video.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BEAUTIFUL CUSTOM CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 border border-white/40 overflow-hidden text-center z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {confirmState.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  {confirmState.message}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl bg-slate-300 text-slate-700 hover:text-slate-800 text-xs font-black transition-all border-0 cursor-pointer flex-1"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmState.onConfirm}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all border-0 cursor-pointer shadow-sm shadow-red-600/20 flex-1"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
