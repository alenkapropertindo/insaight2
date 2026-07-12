import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ExternalLink, 
  Clock, 
  Play, 
  Copy, 
  Check, 
  ArrowLeft, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  Code,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
  Save,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CoursePageView from "./CoursePageView";
import { WorkflowItem, defaultWorkflowsData } from "../defaultWorkflows";
import { supabase } from "../lib/supabase";

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

interface WorkflowToolsProps {
  memberName: string;
}

export default function WorkflowTools({ memberName }: WorkflowToolsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [selectedPromptItem, setSelectedPromptItem] = useState<WorkflowItem | null>(null);
  const [selectedMateriItem, setSelectedMateriItem] = useState<WorkflowItem | null>(null);
  const [activeTutorialVideoItem, setActiveTutorialVideoItem] = useState<WorkflowItem | null>(null);
  const [promptVariables, setPromptVariables] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [workflowData, setWorkflowData] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
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
          const nonDrafts = formatted.filter(item => !item.isDraft);
          setWorkflowData(nonDrafts);
          localStorage.setItem("insaight_workflows", JSON.stringify(formatted));
        } else {
          // Empty workflows table, try to seed
          await seedDefaultWorkflows();
        }
      } catch (err) {
        console.error("Exception fetching workflows:", err);
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const stored = localStorage.getItem("insaight_workflows");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as WorkflowItem[];
          setWorkflowData(parsed.filter(item => !item.isDraft));
        } catch (err) {
          console.error("Failed to parse stored workflows", err);
          setWorkflowData(defaultWorkflowsData);
        }
      } else {
        localStorage.setItem("insaight_workflows", JSON.stringify(defaultWorkflowsData));
        setWorkflowData(defaultWorkflowsData);
      }
    };

    const seedDefaultWorkflows = async () => {
      try {
        const rows = defaultWorkflowsData.map(item => ({
          id: item.id,
          category: item.category,
          is_new: item.isNew,
          title: item.title,
          description: item.description,
          prompt_template: item.promptTemplate,
          variables: item.variables,
          materi_tutorial: {
            ...item.materiTutorial,
            is_draft: item.isDraft ?? false
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
      // Always set state even if seeding failed
      setWorkflowData(defaultWorkflowsData);
      localStorage.setItem("insaight_workflows", JSON.stringify(defaultWorkflowsData));
    };

    fetchWorkflows();
  }, []);

  // Filters categories dynamically based on available workflows in database
  const categories = useMemo(() => {
    const activeCats = new Set<string>();
    workflowData.forEach(item => {
      if (item.category && item.category.trim() !== "") {
        activeCats.add(item.category.trim());
      }
    });
    return ["Semua Kategori", ...Array.from(activeCats).sort()];
  }, [workflowData]);

  const handleOpenPromptModal = (item: WorkflowItem) => {
    setSelectedPromptItem(item);
    // Initialize variables with defaults
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

  // Filtered workflows list based on category and search query
  const filteredWorkflows = workflowData.filter(item => {
    const matchesCategory = activeCategory === "Semua Kategori" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-slate-600 bg-[#e2e8f0]/30 rounded-3xl shadow-inner border border-white/20">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-semibold">Memuat materi dari Supabase...</p>
      </div>
    );
  }

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
        alert("Gagal menyimpan perubahan ke database!");
      } else {
        setHasUnsavedChanges(false);
        alert("Perubahan berhasil disimpan ke database! 🎉");
      }
    } catch (err) {
      console.error("Error upserting to Supabase:", err);
      alert("Gagal menyimpan perubahan ke database!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full text-slate-800" id="workflow-tools-hub-root">
      
      {selectedMateriItem ? (
        <div className="space-y-4">
          {memberName === "Admin" && (
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
          )}

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
            memberName={memberName}
            onOpenPrompt={handleOpenPromptModal}
            onPlayVideo={(item) => setActiveTutorialVideoItem(item)}
            onUpdateItem={(updatedItem) => {
              setSelectedMateriItem(updatedItem);
              const newWorkflows = workflowData.map(w => w.id === updatedItem.id ? updatedItem : w);
              setWorkflowData(newWorkflows);
              localStorage.setItem("insaight_workflows", JSON.stringify(newWorkflows));
              if (memberName === "Admin") {
                setHasUnsavedChanges(true);
              }
            }}
          />
        </div>
      ) : (
        <>
          {/* HEADER SECTION - Styled exactly like the image in a gorgeous Neumorphic Layout */}
          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">
                PROMPT AUTOMATION PORTAL
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-slate-900 animate-spin-slow" />
              <span>insAIght WORKFLOWS & TOOLS</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Koleksi premium berisi framework prompt profesional, materi panduan, dan langkah-langkah praktis kolaborasi dengan kecerdasan buatan.
            </p>
          </div>

          {/* Request Tool */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                const adminPhone = "6282371068831";
                const text = `Halo Admin insAIght Kendari, saya ${memberName} ingin mengajukan request tool atau prompt AI khusus untuk kebutuhan produktivitas saya.`;
                window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="px-5 py-3 rounded-xl bg-lime-400 text-slate-950 font-black text-xs shadow-md hover:bg-lime-500 active:scale-95 transition-all flex items-center gap-1.5 border-0"
              id="request-new-tool-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Tool</span>
            </button>
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 border-t border-slate-300">
          {/* Interactive Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tool atau kata kunci prompt..."
              className="w-full bg-[#e2e8f0] shadow-neu-inset rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset-sm transition-all border-0"
              id="workflow-search-input"
            />
            <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Minimalist Dropdown Category Filter */}
          <div className="relative sm:w-64 shrink-0">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-[#e2e8f0] shadow-neu-flat text-slate-800 font-extrabold text-xs px-4 py-3 rounded-2xl focus:outline-none focus:shadow-neu-inset-sm border-0 cursor-pointer appearance-none transition-all pr-10"
              id="workflow-category-select"
            >
              {categories.map((cat) => {
                const count = cat === "Semua Kategori"
                  ? workflowData.length
                  : workflowData.filter(item => item.category === cat).length;
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

      {/* CARDS GRID (With count indicator) */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between px-2 text-slate-500 text-[11px] font-bold font-mono">
          <span>MENAMPILKAN: {filteredWorkflows.length} MATERI</span>
          {activeCategory !== "Semua Kategori" && (
            <button
              onClick={() => setActiveCategory("Semua Kategori")}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold border-0 bg-transparent cursor-pointer flex items-center gap-1"
            >
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <Search className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
            <h4 className="font-extrabold text-slate-800">Tidak Ada Hasil Ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Kami tidak menemukan kecocokan untuk kata kunci "{searchQuery}" di kategori ini. Silakan coba kata kunci lain atau kirim request tool baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="workflow-cards-grid">
            {filteredWorkflows.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 flex flex-col justify-between relative hover:shadow-neu-flat-lg hover:scale-[1.01] transition-all border border-[#ffffff]/40 cursor-pointer"
                id={`card-${item.id}`}
                onClick={() => setSelectedMateriItem(item)}
              >
                {/* Top Meta info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold text-slate-500 bg-[#e2e8f0] shadow-neu-inset-sm rounded-md px-2.5 py-1 uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                  {item.isNew && (
                    <span className="text-[9px] font-black bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full tracking-widest shadow-sm uppercase font-mono animate-pulse">
                      NEW
                    </span>
                  )}
                </div>

                {/* Main Content Info */}
                <div className="space-y-2 flex-1">
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
                      id={`btn-tool-${item.id}`}
                    >
                      <span>Buka Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPrompt(item.id, item.promptTemplate);
                      }}
                      className="p-2.5 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-700 hover:text-slate-900 rounded-xl transition-all shrink-0 flex items-center justify-center border-0 cursor-pointer"
                      title="Salin Prompt Mentah"
                      id={`btn-copy-${item.id}`}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4.5 h-4.5 text-green-600 animate-scale-up" />
                      ) : (
                        <Copy className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Row 2: Buka Tutorial (Secondary CTA) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTutorialVideoItem(item);
                    }}
                    className="w-full py-2.5 px-4 bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                    title="Buka Video Tutorial YouTube"
                    id={`btn-materi-${item.id}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>Buka Tutorial</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )}

      {/* MODAL 1: BUKA TOOL (INTERACTIVE PROMPT BUILDER OVERLAY) */}
      <AnimatePresence>
        {selectedPromptItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            {/* Modal Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setSelectedPromptItem(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#e2e8f0] shadow-neu-flat-lg rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col relative border border-[#ffffff]/60 z-10"
              id="prompt-builder-modal"
            >
              {/* Header Box */}
              <div className="p-6 border-b border-slate-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 font-mono bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedPromptItem.category} • TOOL BUILDER
                  </span>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    {selectedPromptItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPromptItem(null)}
                  className="p-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset rounded-xl text-slate-500 hover:text-slate-800 transition-all border-0 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form Variables and Compiled Output Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Instructions info */}
                <div className="p-4 bg-slate-200 border border-slate-350/10 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-lime-600 animate-pulse" />
                    <span>Cara Penggunaan:</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ubah nilai isian parameter pada form di bawah ini. Teks prompt premium akan tersusun secara dinamis dan siap disalin untuk diserahkan ke ChatGPT, Claude, atau Gemini Anda.
                  </p>
                </div>

                {/* Form inputs parameters */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
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

                {/* Live Preview Prompt Area */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      2. Salin Prompt Premium
                    </h4>
                    <button
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

              {/* Footer Panel */}
              <div className="p-4 bg-slate-200 border-t border-slate-300 text-center text-[10px] text-slate-500 font-bold">
                * Gunakan prompt ini dengan GPT-4o, Gemini 1.5 Pro, atau Claude 3.5 Sonnet untuk hasil terbaik.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* MODAL 3: YOUTUBE VIDEO TUTORIAL POPUP */}
      <AnimatePresence>
        {activeTutorialVideoItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            {/* Modal Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setActiveTutorialVideoItem(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-[#e2e8f0] shadow-neu-flat-lg rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative border border-[#ffffff]/60 z-10"
              id="youtube-tutorial-modal"
            >
              {/* Header Box */}
              <div className="p-6 border-b border-slate-300 flex items-center justify-between bg-slate-200/50">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-black text-red-650 font-mono bg-[#e2e8f0] shadow-neu-inset-sm px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {activeTutorialVideoItem.category} • VIDEO TUTORIAL
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                    {activeTutorialVideoItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTutorialVideoItem(null)}
                  className="p-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset rounded-xl text-slate-500 hover:text-slate-800 transition-all border-0 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* YouTube Video Player Wrapper */}
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

              {/* Footer Box */}
              <div className="p-4 bg-slate-200 border-t border-slate-300 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const currentItem = activeTutorialVideoItem;
                    setActiveTutorialVideoItem(null);
                    setTimeout(() => setSelectedMateriItem(currentItem), 200);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1.5 border-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka Roadmap & Resource</span>
                </button>
                <button
                  onClick={() => setActiveTutorialVideoItem(null)}
                  className="px-4 py-2 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-xs font-bold text-slate-700 hover:text-slate-900 border-0 cursor-pointer rounded-xl"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
