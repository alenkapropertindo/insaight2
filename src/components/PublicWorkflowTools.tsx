import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  RefreshCw, 
  Lock, 
  Unlock, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Tv, 
  Cpu, 
  UserPlus, 
  LogIn, 
  X,
  Play,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { defaultWorkflowsData, WorkflowItem } from "../defaultWorkflows";

interface PublicWorkflowToolsProps {
  onJoinClick: () => void;
  onMemberClick: () => void;
}

export default function PublicWorkflowTools({ onJoinClick, onMemberClick }: PublicWorkflowToolsProps) {
  const [workflowData, setWorkflowData] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal locks & detail view
  const [selectedMateriItem, setSelectedMateriItem] = useState<WorkflowItem | null>(null);
  const [activeTutorialVideoItem, setActiveTutorialVideoItem] = useState<WorkflowItem | null>(null);
  const [showLockedModal, setShowLockedModal] = useState<WorkflowItem | null>(null);
  const [promptVariables, setPromptVariables] = useState<{ [key: string]: string }>({});

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
          
          // Filter out drafts entirely. Public view ONLY shows non-drafts.
          const nonDrafts = formatted.filter(item => !item.isDraft);
          setWorkflowData(nonDrafts);
          localStorage.setItem("insaight_workflows", JSON.stringify(formatted));
        } else {
          // Empty workflows table, try fallback
          loadFallback();
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
          setWorkflowData(defaultWorkflowsData.filter(item => !item.isDraft));
        }
      } else {
        setWorkflowData(defaultWorkflowsData.filter(item => !item.isDraft));
      }
    };

    fetchWorkflows();
  }, []);

  // Sync variables state when selected item changes
  useEffect(() => {
    if (selectedMateriItem) {
      const vars: { [key: string]: string } = {};
      Object.keys(selectedMateriItem.variables || {}).forEach(k => {
        vars[k] = "";
      });
      setPromptVariables(vars);
    }
  }, [selectedMateriItem]);

  const categories = useMemo(() => {
    const activeCats = new Set<string>();
    workflowData.forEach(item => {
      if (item.category && item.category.trim() !== "") {
        activeCats.add(item.category.trim());
      }
    });
    return ["Semua Kategori", ...Array.from(activeCats).sort()];
  }, [workflowData]);

  const filteredWorkflows = workflowData.filter(item => {
    const matchesCategory = activeCategory === "Semua Kategori" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleCardClick = (item: WorkflowItem) => {
    if (item.isPublic) {
      setSelectedMateriItem(item);
    } else {
      setShowLockedModal(item);
    }
  };

  return (
    <div className="space-y-8 w-full text-slate-800" id="public-workflows-hub-root">
      
      {/* Upper Premium Header Banner */}
      <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#ffffff]/50">
        <div className="space-y-2 text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold tracking-wide uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>Katalog Materi & Workflow</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase">
            Eksplorasi Workflow & Tools AI Gratis & Premium
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold max-w-2xl">
            Di bawah ini adalah daftar materi pembelajaran, prompt generator, dan video tutorial yang kami sediakan untuk melesatkan konten Anda. Beberapa materi ditandai <span className="text-emerald-600 font-bold">Terbuka (Publik)</span>, sementara materi premium lainnya dapat diakses penuh setelah mendaftar.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={onMemberClick}
            className="px-5 py-3 rounded-2xl bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-indigo-600" />
            <span>Login Member</span>
          </button>
          <button
            onClick={onJoinClick}
            className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-extrabold text-xs shadow-md hover:bg-slate-850 active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-lime-400" />
            <span>Daftar / Join Komunitas</span>
          </button>
        </div>
      </div>

      {/* Detail view of public unlocked material */}
      {selectedMateriItem ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 border border-white/40 space-y-8 text-left relative"
        >
          {/* Back btn */}
          <button
            onClick={() => setSelectedMateriItem(null)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {selectedMateriItem.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight uppercase leading-none pt-2">
              {selectedMateriItem.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Variables & Prompt Builder */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#e2e8f0] shadow-neu-inset-sm rounded-2xl p-5 md:p-6 border border-white/20 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                  <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>Prompt Generator</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                    <Unlock className="w-3 h-3" />
                    Akses Publik
                  </span>
                </div>

                {/* Fill Variables Section */}
                {Object.keys(selectedMateriItem.variables || {}).length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      Lengkapi Variabel di Bawah Ini:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(selectedMateriItem.variables || {}).map(([key, placeholder]) => (
                        <div key={key} className="space-y-1.5 text-left">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight">
                            {key.replaceAll("_", " ")}
                          </label>
                          <input
                            type="text"
                            placeholder={placeholder as string}
                            value={promptVariables[key] || ""}
                            onChange={(e) => setPromptVariables(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold placeholder:text-slate-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100/50 rounded-xl text-center text-slate-500 text-xs font-semibold">
                    Materi ini tidak memiliki variabel input. Prompt di bawah ini sudah siap langsung digunakan.
                  </div>
                )}

                {/* Preview Compiled Prompt */}
                <div className="space-y-2 text-left pt-2">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight flex justify-between items-center">
                    <span>Hasil Prompt Anda:</span>
                    {copiedId === selectedMateriItem.id ? (
                      <span className="text-green-600 font-bold lowercase">berhasil disalin!</span>
                    ) : (
                      <span className="text-slate-400 font-bold lowercase">klik salin untuk menyalin prompt</span>
                    )}
                  </label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={getCompiledPrompt(selectedMateriItem)}
                      className="w-full h-44 bg-[#e2e8f0] shadow-neu-inset-sm rounded-2xl p-4 text-xs font-mono text-slate-800 focus:outline-none border-0 leading-relaxed resize-none pr-12 select-all"
                    />
                    <button
                      onClick={() => handleCopyPrompt(selectedMateriItem.id, getCompiledPrompt(selectedMateriItem))}
                      className="absolute top-3 right-3 p-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-600 hover:text-slate-900 transition-all cursor-pointer border-0 shrink-0"
                      title="Salin Prompt"
                    >
                      {copiedId === selectedMateriItem.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedMateriItem.geminiToolUrl || "https://gemini.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer text-center no-underline"
                  >
                    <span>Luncurkan AI Tool (Gemini)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {selectedMateriItem.youtubeUrl && (
                    <button
                      onClick={() => setActiveTutorialVideoItem(selectedMateriItem)}
                      className="py-3 px-5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-red-500 text-red-500" />
                      <span>Nonton Tutorial Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Steps Overview & Tutorial */}
            <div className="lg:col-span-5 space-y-6">
              {/* Step-by-step Tutorial Block */}
              <div className="bg-[#e2e8f0] shadow-neu-flat rounded-2xl p-5 md:p-6 border border-white/20 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-tight pb-2 border-b border-slate-300">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Tutorial & Langkah Kerja</span>
                </h4>
                
                {selectedMateriItem.materiTutorial?.overview && (
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed bg-[#e2e8f0] shadow-neu-inset-sm p-4 rounded-xl border border-white/20">
                    {selectedMateriItem.materiTutorial.overview}
                  </p>
                )}

                {selectedMateriItem.materiTutorial?.steps && selectedMateriItem.materiTutorial.steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">
                      Tahapan Eksekusi:
                    </p>
                    <div className="space-y-2.5">
                      {selectedMateriItem.materiTutorial.steps.map((step, index) => (
                        <div key={index} className="flex gap-3 text-left">
                          <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shadow-neu-flat-sm border border-indigo-200/50">
                            {index + 1}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium pt-0.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Search and Category Filter Section */}
      <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 space-y-4 text-left border border-white/30">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari materi tutorial atau workflow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-2xl pl-12 pr-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:shadow-neu-inset border-0 font-bold placeholder:text-slate-400"
              id="public-workflow-search-input"
            />
            <div className="absolute left-4 top-4 text-slate-500">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Minimalist Dropdown Category List Filter */}
          <div className="w-full lg:w-72">
            <div className="relative">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-[#e2e8f0] shadow-neu-flat text-slate-800 font-extrabold text-xs px-4 py-3.5 rounded-2xl focus:outline-none focus:shadow-neu-inset-sm border-0 cursor-pointer appearance-none transition-all pr-10"
                id="public-workflow-category-select"
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
              <div className="absolute right-4 top-4 text-slate-500 pointer-events-none">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS LIST GRID */}
      <div className="space-y-4">
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
              Tidak ada materi yang cocok untuk kata kunci "{searchQuery}". Silakan coba kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorkflows.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(item)}
                className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 flex flex-col justify-between relative hover:shadow-neu-flat-lg hover:scale-[1.01] transition-all border border-[#ffffff]/40 cursor-pointer text-left hover:border-slate-400/40"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold text-slate-500 bg-[#e2e8f0] shadow-neu-inset-sm rounded-md px-2.5 py-1 uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                  
                  {/* Lock Indicator badge */}
                  {item.isPublic ? (
                    <span className="text-[9px] font-bold bg-[#e2e8f0] shadow-neu-inset-sm text-indigo-650 px-2.5 py-1 rounded-md uppercase font-mono flex items-center gap-1 border-0">
                      <Unlock className="w-2.5 h-2.5 text-indigo-500" />
                      <span>Publik</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-[#e2e8f0] shadow-neu-inset-sm text-slate-500 px-2.5 py-1 rounded-md uppercase font-mono flex items-center gap-1 border-0">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Terkunci</span>
                    </span>
                  )}
                </div>

                {/* Main Body content */}
                <div className="space-y-2 flex-1 relative">
                  {/* Subtle Padlock icon inside content background for locked items */}
                  {!item.isPublic && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-300/30 border border-slate-300 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight uppercase font-sans pr-8">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Action button container */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-300">
                  {item.isPublic ? (
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer"
                    >
                      <span>Buka Prompt Builder</span>
                      <Unlock className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Premium (Terkunci)</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LOCKED MODAL FOR MARKETING CONVERSION */}
      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 max-w-md w-full border border-white/50 text-slate-800 space-y-6 relative text-center"
            >
              <button
                onClick={() => setShowLockedModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-neu-flat-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Materi Premium Terkunci
                  </h3>
                  <p className="text-xs text-indigo-600 font-extrabold uppercase tracking-widest font-mono">
                    {showLockedModal.title}
                  </p>
                </div>
              </div>

              <div className="bg-[#e2e8f0] shadow-neu-inset-sm p-4 rounded-2xl text-left border border-white/20">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Maaf, materi pembelajaran dan prompt generator ini hanya tersedia bagi anggota resmi komunitas <strong className="text-slate-800">insAIght_Kendari</strong>.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-[11px] text-slate-500 font-bold">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>Akses penuh ratusan prompt premium</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-500 font-bold">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>Video tutorial eksklusif di YouTube</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-500 font-bold">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>Live sharing & update tool berkala</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setShowLockedModal(null);
                    onMemberClick();
                  }}
                  className="w-full py-3 bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-800 font-extrabold text-xs rounded-xl border-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Sudah Punya Akun? Login Sekarang</span>
                </button>
                <button
                  onClick={() => {
                    setShowLockedModal(null);
                    onJoinClick();
                  }}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl border-0 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-lime-400" />
                  <span>Daftar Area Member / Join Komunitas</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO TUTORIAL EMBED PLAYER MODAL */}
      <AnimatePresence>
        {activeTutorialVideoItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 max-w-3xl w-full border border-white/50 text-slate-800 space-y-4 relative"
            >
              <button
                onClick={() => setActiveTutorialVideoItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-0 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left space-y-1">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {activeTutorialVideoItem.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pt-1">
                  Video Tutorial: {activeTutorialVideoItem.title}
                </h3>
              </div>

              {/* YouTube Responsive iFrame Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-neu-inset-sm border border-white/20 bg-black">
                <iframe
                  src={activeTutorialVideoItem.youtubeUrl?.replace("watch?v=", "embed/")}
                  title={`Tutorial Video: ${activeTutorialVideoItem.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              <div className="text-left p-3.5 bg-slate-100/50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-semibold">
                Tonton tutorial di atas langkah demi langkah. Silakan gunakan template prompt yang telah disalin di panel sebelah kiri untuk langsung dipraktekkan di Gemini atau ChatGPT!
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
