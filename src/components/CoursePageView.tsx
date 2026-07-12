import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Play, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  Code, 
  FileText, 
  Sparkles,
  ExternalLink,
  Award,
  Copy,
  Plus,
  Trash,
  Link as LinkIcon,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  WorkflowItem, 
  RoadmapStep, 
  SubTask, 
  PromptVariable 
} from "../defaultWorkflows";

interface CoursePageViewProps {
  item: WorkflowItem;
  onBack: () => void;
  memberName: string;
  onOpenPrompt: (item: WorkflowItem) => void;
  onEdit?: (item: WorkflowItem) => void;
  onUpdateItem?: (updatedItem: WorkflowItem) => void;
  onPlayVideo?: (item: WorkflowItem) => void;
}

export default function CoursePageView({ item, onBack, memberName, onOpenPrompt, onEdit, onUpdateItem, onPlayVideo }: CoursePageViewProps) {
  // Generate custom roadmap stages with realistic interactive prompts
  const getRoadmapData = (): RoadmapStep[] => {
    switch (item.id) {
      case "wf-1":
        return [
          {
            id: 1,
            title: "User Authentication (Sign Up & Login)",
            watchUrl: "https://supabase.com/docs/guides/auth",
            subTasks: [
              { 
                id: "wf1-1-1", 
                text: "Create Supabase Project",
                link: { text: "Open Supabase ↗", url: "https://supabase.com" }
              },
              { 
                id: "wf1-1-2", 
                text: "Copy Project URL + Publishable Key" 
              },
              { 
                id: "wf1-1-3", 
                text: "Prompt 1 — Supabase Connection",
                isPrompt: true,
                promptTitle: "Supabase Connection",
                promptDescription: "Create a simple Supabase connection file for this project.",
                promptVariables: [
                  { key: "SUPABASE_URL", label: "Supabase Project URL", placeholder: "Paste your Supabase project URL here" },
                  { key: "SUPABASE_KEY", label: "Supabase Publishable Key", placeholder: "Paste your Supabase publishable key here" }
                ],
                promptTemplate: `I want you to connect this web app to Supabase.

1) Analyze the existing project and configure the connection details in src/lib/supabase.ts.
Use the following credentials:
Supabase URL: [SUPABASE_URL]
Supabase Anon Key: [SUPABASE_KEY]

2) Create a complete signup and login layout with Neumorphic card style.
3) Make sure users can sign in with their email, and store user sessions in React state.`
              },
              { 
                id: "wf1-1-4", 
                text: "Prompt 2 — Email Auth Logic",
                isPrompt: true,
                promptTitle: "Email Auth Logic",
                promptDescription: "Connect the Sign In and Sign Up pages in this project to Supabase Auth.",
                promptTemplate: `Please build the email-password registration and login handlers in src/components/Auth.tsx.
Integrate them with Supabase auth functions:
- supabase.auth.signUp({ email, password })
- supabase.auth.signInWithPassword({ email, password })

Ensure you handle success and error states beautifully with standard Tailwind notification blocks. Provide user session state persistence in React.`
              }
            ]
          },
          {
            id: 2,
            title: "Store User Data (Database)",
            watchUrl: "https://supabase.com/docs/guides/database",
            subTasks: [
              { 
                id: "wf1-2-1", 
                text: "Prompt 3 — Generate Tables + CRUD",
                isPrompt: true,
                promptTitle: "Generate Tables + CRUD",
                promptDescription: "Based on the UI and the current features, generate the ideal SQL code and CRUD helpers.",
                promptVariables: [
                  { key: "TABLE_NAME", label: "Table Name", placeholder: "e.g. notes, tasks, items" }
                ],
                promptTemplate: `I want you to create a database table in Supabase.

1) Generate SQL code to create table '[TABLE_NAME]' with the following fields:
   - id: uuid primary key
   - user_id: uuid reference to auth.users (RLS enabled)
   - title: text
   - status: text
   - created_at: timestamptz

2) Write client-side JS functions using supabase client to fetch, insert, update, and delete rows in '[TABLE_NAME]' for the authenticated user.`
              },
              { 
                id: "wf1-2-2", 
                text: "Verify Database Setup",
                subItems: [
                  { id: "wf1-2-2-a", text: "Run generated SQL in Supabase SQL Editor" },
                  { id: "wf1-2-2-b", text: "Test saving data from UI to Supabase" }
                ]
              }
            ]
          },
          {
            id: 3,
            title: "File Uploads (Supabase Storage)",
            watchUrl: "https://supabase.com/docs/guides/storage",
            subTasks: [
              { 
                id: "wf1-3-1", 
                text: "Prompt 4 — Setup Supabase Storage Bucket & Upload logic",
                isPrompt: true,
                promptTitle: "Setup Supabase Storage Bucket & Upload logic",
                promptDescription: "Create a storage bucket and implement drag-and-drop file uploading.",
                promptVariables: [
                  { key: "BUCKET_NAME", label: "Bucket Name", placeholder: "e.g. user-uploads, avatars" }
                ],
                promptTemplate: `I want you to add file uploading support using Supabase Storage.

1) Create a public bucket named '[BUCKET_NAME]' in Supabase.
2) Build a neat drag-and-drop file uploader component styled with Tailwind CSS.
3) Use the supabase.storage.from('[BUCKET_NAME]').upload() function to upload and retrieve the public URL.`
              },
              { 
                id: "wf1-3-2", 
                text: "Verify Upload System",
                subItems: [
                  { id: "wf1-3-2-a", text: "Upload standard mockup PNG image" },
                  { id: "wf1-3-2-b", text: "Verify public URL resolves correctly" }
                ]
              }
            ]
          },
          {
            id: 4,
            title: "Connect to UI (Dynamic System)",
            subTasks: [
              { id: "wf1-4-1", text: "Mapping Data Hasil Query Supabase ke State React" },
              { id: "wf1-4-2", text: "Penyelarasan Desain Dashboard Neumorphic dengan State Baru" }
            ]
          }
        ];
      case "wf-2":
        return [
          {
            id: 1,
            title: "Riset & Konsep Mainan",
            watchUrl: "https://pinterest.com",
            subTasks: [
              { 
                id: "wf2-1-1", 
                text: "Menentukan Karakter Populer & Target Usia Anak",
                link: { text: "Cari Inspirasi Karakter ↗", url: "https://pinterest.com" }
              },
              { id: "wf2-1-2", text: "Merancang Garis Lipat & Potong Teoretis" }
            ]
          },
          {
            id: 2,
            title: "Generate Pola Gambar 3D",
            watchUrl: "https://midjourney.com",
            subTasks: [
              { 
                id: "wf2-2-1", 
                text: "Prompt 2 — AI Image Generator for 3D Papercraft Toy",
                isPrompt: true,
                promptTitle: "AI Image Generator for 3D Papercraft Toy",
                promptDescription: "Buat blueprint 2D dari model 3D menggunakan kecerdasan buatan.",
                promptVariables: [
                  { key: "CHARACTER_STYLE", label: "Karakter / Style", placeholder: "e.g. robot, cat, ninja, superhero" },
                  { key: "THEME_COLOR", label: "Tema Warna Utama", placeholder: "e.g. pastel blue, neon pink, wooden oak" }
                ],
                promptTemplate: `Generate a flat 2D vector layout template for a 3D printable papercraft toy character. 
The layout should show the head, torso, arms, and legs flat on a single white background canvas, with clear dotted lines representing folding guides and solid lines representing cutting guides. 
Style: Cute retro low-poly [CHARACTER_STYLE] character, bright flat [THEME_COLOR] colors, high resolution, top-down isometric blueprint style.`
              },
              { id: "wf2-2-2", text: "Melakukan Upscaling Gambar Kualitas Tinggi" }
            ]
          },
          {
            id: 3,
            title: "Layouting & Cetak PDF",
            subTasks: [
              { 
                id: "wf2-3-1", 
                text: "Prompt 3 — Assembly Instructions copywriter",
                isPrompt: true,
                promptTitle: "Assembly Instructions copywriter",
                promptDescription: "Tulis panduan merakit mainan lipat kertas yang mudah dipahami.",
                promptTemplate: `Write a clear, friendly, step-by-step instruction manual for parents and children on how to cut, fold, and glue this 3D papercraft toy. 
Include a list of necessary materials (scissors, paper-glue) and estimated completion time (15-20 mins). 
Format: Clean Markdown list.`
              },
              { 
                id: "wf2-3-2", 
                text: "Verify Print Output",
                subItems: [
                  { id: "wf2-3-2-a", text: "Ekspor PDF Print Resolusi Tinggi" },
                  { id: "wf2-3-2-b", text: "Coba lipat dummy papercraft" }
                ]
              }
            ]
          }
        ];
      case "wf-3":
        return [
          {
            id: 1,
            title: "Strategi Hook & Retensi",
            watchUrl: "https://tiktok.com",
            subTasks: [
              { 
                id: "wf3-1-1", 
                text: "Menentukan Kalimat Pembuka 'The Grabber' yang Kontradiktif",
                link: { text: "Lihat Tren TikTok ↗", url: "https://tiktok.com" }
              },
              { id: "wf3-1-2", text: "Menyusun Ketegangan Konflik di Detik Awal" }
            ]
          },
          {
            id: 2,
            title: "Penyusunan Naskah Lengkap",
            watchUrl: "https://chatgpt.com",
            subTasks: [
              { 
                id: "wf3-2-1", 
                text: "Prompt 2 — AI Reels Hook Generator",
                isPrompt: true,
                promptTitle: "AI Reels Hook Generator",
                promptDescription: "Buat kalimat pembuka yang mengejutkan penonton dalam 3 detik pertama.",
                promptVariables: [
                  { key: "TOPIC", label: "Topik Video", placeholder: "e.g. Tips coding AI, setup workstation, tutorial Figma" }
                ],
                promptTemplate: `Generate 5 highly engaging, pattern-interrupting hook ideas for a 30-second tech tutorial reel about "[TOPIC]". 
The hooks must start with a controversial statement or a surprising statistic.
Example: "99% of people are using ChatGPT wrong... here is how the top 1% does it."`
              },
              { 
                id: "wf3-2-2", 
                text: "Prompt 3 — Complete 30-Sec Educational Script",
                isPrompt: true,
                promptTitle: "Complete 30-Sec Educational Script",
                promptDescription: "Buat naskah video pendek berdurasi 30 detik secara menyeluruh.",
                promptTemplate: `Write a full 30-second fast-paced educational script with visual cues and speaker text.
Topic: How to automate your database setup using AI and Supabase.
Tone: High energy, concise, actionable. 
Include instructions for B-roll footage and fast-cut text overlays.`
              }
            ]
          },
          {
            id: 3,
            title: "Rekaman & Editing",
            subTasks: [
              { id: "wf3-3-1", text: "Merekam Suara dengan Intonasi Dinamis" },
              { id: "wf3-3-2", text: "Menambahkan Word-by-Word Subtitle Berganti Cepat" }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const getCurrentRoadmap = (): RoadmapStep[] => {
    if (item.roadmap && Array.isArray(item.roadmap) && item.roadmap.length > 0) {
      return item.roadmap;
    }
    return getRoadmapData();
  };

  const rawSteps = getCurrentRoadmap();
  
  // State for user-added custom subtasks/links
  const [userCustomItems, setUserCustomItems] = useState<{ [stepId: number]: SubTask[] }>({});
  
  // State for beautiful confirmation dialog
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Hapus",
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText: string = "Hapus") => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };
  
  // State for customized prompt variable values
  const [promptVarValues, setPromptVarValues] = useState<{ [subTaskId: string]: { [varKey: string]: string } }>({});
  
  // States for accordion-like toggle inside prompt cards
  const [expandedCustomizations, setExpandedCustomizations] = useState<{ [subTaskId: string]: boolean }>({});
  const [shownFinalPrompts, setShownFinalPrompts] = useState<{ [subTaskId: string]: boolean }>({});
 
  // Modal states for adding custom items
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedStepIdForCustom, setSelectedStepIdForCustom] = useState<number | null>(null);
  const [customItemType, setCustomItemType] = useState<"link" | "prompt" | "simple">("link");
  const [customTitle, setCustomTitle] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customTemplate, setCustomTemplate] = useState("");
  const [customVarsInput, setCustomVarsInput] = useState("");

  // Load custom items and prompt variables on mount
  useEffect(() => {
    try {
      const storedCustom = localStorage.getItem(`course-custom-items-${item.id}`);
      if (storedCustom) {
        setUserCustomItems(JSON.parse(storedCustom));
      }
      const storedVars = localStorage.getItem(`course-prompt-vars-${item.id}`);
      if (storedVars) {
        setPromptVarValues(JSON.parse(storedVars));
      }
    } catch (e) {
      console.error(e);
    }
  }, [item.id]);

  const handleAddCustomItem = (stepId: number, newSubTask: SubTask) => {
    const next = {
      ...userCustomItems,
      [stepId]: [...(userCustomItems[stepId] || []), newSubTask]
    };
    setUserCustomItems(next);
    localStorage.setItem(`course-custom-items-${item.id}`, JSON.stringify(next));
  };

  const handleDeleteCustomItem = (stepId: number, subTaskId: string) => {
    const next = {
      ...userCustomItems,
      [stepId]: (userCustomItems[stepId] || []).filter(sub => sub.id !== subTaskId)
    };
    setUserCustomItems(next);
    localStorage.setItem(`course-custom-items-${item.id}`, JSON.stringify(next));
    
    // clean from completed list if any
    setCompletedTasks(prev => {
      const nextCompleted = prev.filter(id => id !== subTaskId);
      localStorage.setItem(`course-progress-${item.id}`, JSON.stringify(nextCompleted));
      return nextCompleted;
    });
  };

  const handleDeleteSubTask = (stepId: number, subTaskId: string) => {
    // 1. Delete from userCustomItems if it exists there
    const isCustomLocal = (userCustomItems[stepId] || []).some(st => st.id === subTaskId);
    if (isCustomLocal) {
      handleDeleteCustomItem(stepId, subTaskId);
    }

    // 2. Delete from item.roadmap if it exists there
    const currentRoadmap = getCurrentRoadmap();
    let foundInRoadmap = false;
    const updatedRoadmap = currentRoadmap.map(s => {
      const hasSubTask = s.subTasks.some(st => st.id === subTaskId);
      if (hasSubTask) {
        foundInRoadmap = true;
        return {
          ...s,
          subTasks: s.subTasks.filter(st => st.id !== subTaskId)
        };
      }
      return s;
    });

    if (foundInRoadmap) {
      onUpdateItem?.({
        ...item,
        roadmap: updatedRoadmap
      });
    }
  };

  const handlePromptVarChange = (subTaskId: string, varKey: string, value: string) => {
    const next = {
      ...promptVarValues,
      [subTaskId]: {
        ...(promptVarValues[subTaskId] || {}),
        [varKey]: value
      }
    };
    setPromptVarValues(next);
    localStorage.setItem(`course-prompt-vars-${item.id}`, JSON.stringify(next));
    
    // Reset the edited prompt override so it re-compiles with the new variables automatically!
    setEditedPrompts(prev => {
      const copy = { ...prev };
      delete copy[subTaskId];
      return copy;
    });
  };

  const compilePromptText = (sub: SubTask) => {
    let text = sub.promptTemplate || "";
    if (sub.promptVariables) {
      sub.promptVariables.forEach(v => {
        const typedValue = promptVarValues[sub.id]?.[v.key] || "";
        text = text.replaceAll(`[${v.key}]`, typedValue || `[${v.key}]`);
      });
    }
    return text;
  };

  const getPromptTextToShow = (sub: SubTask) => {
    if (editedPrompts[sub.id] !== undefined) {
      return editedPrompts[sub.id];
    }
    return compilePromptText(sub);
  };

  const toggleCustomization = (subId: string) => {
    setExpandedCustomizations(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleShowFinalPrompt = (subId: string) => {
    setShownFinalPrompts(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const handleSaveCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStepIdForCustom) return;
    if (!customTitle.trim()) {
      alert("Judul tidak boleh kosong!");
      return;
    }

    const generatedId = `custom-${Date.now()}`;
    let newSubTask: SubTask;

    if (customItemType === "simple") {
      newSubTask = {
        id: generatedId,
        text: customTitle.trim()
      };
    } else if (customItemType === "link") {
      if (!customUrl.trim()) {
        alert("URL tidak boleh kosong!");
        return;
      }
      newSubTask = {
        id: generatedId,
        text: customTitle.trim(),
        link: {
          text: customTitle.trim().includes("↗") ? customTitle.trim() : `${customTitle.trim()} ↗`,
          url: customUrl.trim().startsWith("http") ? customUrl.trim() : `https://${customUrl.trim()}`
        }
      };
    } else {
      // Parse variables: user can write "VAR_KEY:Label, VAR_KEY2:Label2" or similar
      const promptVariables: PromptVariable[] = [];
      if (customVarsInput.trim()) {
        const pairs = customVarsInput.split(",");
        pairs.forEach(p => {
          const parts = p.split(":");
          if (parts[0]) {
            const key = parts[0].trim().toUpperCase();
            const label = parts[1] ? parts[1].trim() : parts[0].trim();
            promptVariables.push({
              key,
              label,
              placeholder: `Masukkan ${label} di sini`
            });
          }
        });
      }

      newSubTask = {
        id: generatedId,
        text: customTitle.trim(),
        isPrompt: true,
        promptTitle: customTitle.trim(),
        promptDescription: customDesc.trim() || "Kustom prompt yang dibuat oleh Anda.",
        promptTemplate: customTemplate.trim() || `Silakan lakukan sesuatu dengan variabel ini.`,
        promptVariables: promptVariables.length > 0 ? promptVariables : undefined
      };
    }

    if (memberName === "Admin") {
      const currentRoadmap = getCurrentRoadmap();
      const updatedRoadmap = currentRoadmap.map(s => {
        if (s.id === selectedStepIdForCustom) {
          return {
            ...s,
            subTasks: [...s.subTasks, newSubTask]
          };
        }
        return s;
      });
      onUpdateItem?.({
        ...item,
        roadmap: updatedRoadmap
      });
    } else {
      handleAddCustomItem(selectedStepIdForCustom, newSubTask);
    }
    
    // Clear states
    setCustomTitle("");
    setCustomUrl("");
    setCustomDesc("");
    setCustomTemplate("");
    setCustomVarsInput("");
    setIsCustomModalOpen(false);
  };

  // Merge default steps with user custom items
  const steps = rawSteps.map(step => {
    const customList = userCustomItems[step.id] || [];
    return {
      ...step,
      subTasks: [...step.subTasks, ...customList]
    };
  });
  
  // Flatten all subtasks / subItems to get the full tickable checklist items
  const getTickableItems = (roadmapSteps: RoadmapStep[]) => {
    const items: { id: string; text: string }[] = [];
    roadmapSteps.forEach(step => {
      step.subTasks.forEach(st => {
        if (st.subItems && st.subItems.length > 0) {
          st.subItems.forEach(si => {
            items.push({ id: si.id, text: si.text });
          });
        } else {
          items.push({ id: st.id, text: st.text });
        }
      });
    });
    return items;
  };

  const allTickableItems = getTickableItems(steps);
  
  // Local state to store completed tasks
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 2]); // Expand first and second steps by default to showcase the layout nicely
  const [hiddenPrompts, setHiddenPrompts] = useState<{ [key: string]: boolean }>({});
  const [editedPrompts, setEditedPrompts] = useState<{ [key: string]: string }>({});
  const [copyFeedback, setCopyFeedback] = useState<{ [key: string]: boolean }>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`course-progress-${item.id}`);
      if (stored) {
        setCompletedTasks(JSON.parse(stored));
      } else {
        // Mock some initially completed tasks
        if (item.id === "wf-1") {
          const initial = ["wf1-1-1"];
          setCompletedTasks(initial);
          localStorage.setItem(`course-progress-${item.id}`, JSON.stringify(initial));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [item.id]);

  // Save progress when it changes
  const toggleTask = (taskId: string) => {
    let next;
    if (completedTasks.includes(taskId)) {
      next = completedTasks.filter(id => id !== taskId);
    } else {
      next = [...completedTasks, taskId];
    }
    setCompletedTasks(next);
    localStorage.setItem(`course-progress-${item.id}`, JSON.stringify(next));
  };

  // Calculate percentages
  const totalCount = allTickableItems.length;
  const completedCount = allTickableItems.filter(st => completedTasks.includes(st.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle step expansion
  const toggleStepExpansion = (stepId: number) => {
    if (expandedSteps.includes(stepId)) {
      setExpandedSteps(expandedSteps.filter(id => id !== stepId));
    } else {
      setExpandedSteps([...expandedSteps, stepId]);
    }
  };

  // Toggle prompt hide/show
  const togglePromptHide = (promptId: string) => {
    setHiddenPrompts(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  };

  // Handle live edit of prompt
  const handlePromptChange = (promptId: string, value: string) => {
    setEditedPrompts(prev => ({
      ...prev,
      [promptId]: value
    }));

    if (memberName === "Admin") {
      const currentRoadmap = getCurrentRoadmap();
      const updatedRoadmap = currentRoadmap.map(s => {
        return {
          ...s,
          subTasks: s.subTasks.map(st => {
            if (st.id === promptId) {
              return {
                ...st,
                promptTemplate: value
              };
            }
            return st;
          })
        };
      });
      onUpdateItem?.({
        ...item,
        roadmap: updatedRoadmap
      });
    }
  };

  // Copy prompt text
  const handleCopyPrompt = (promptId: string, sub: SubTask) => {
    const textToCopy = getPromptTextToShow(sub);
    navigator.clipboard.writeText(textToCopy);
    
    setCopyFeedback(prev => ({ ...prev, [promptId]: true }));
    setTimeout(() => {
      setCopyFeedback(prev => ({ ...prev, [promptId]: false }));
    }, 2000);
  };

  // Reset Progress handler
  const handleResetProgress = (e: React.MouseEvent) => {
    e.preventDefault();
    showConfirm(
      "Setel Ulang Kemajuan?",
      "Apakah Anda yakin ingin menyetel ulang semua kemajuan belajar materi ini? Tindakan ini tidak bisa dibatalkan.",
      () => {
        setCompletedTasks([]);
        localStorage.setItem(`course-progress-${item.id}`, JSON.stringify([]));
      },
      "Ya, Setel Ulang"
    );
  };

  // Up Next task finder
  const getUpNextTask = () => {
    const nextIncomplete = allTickableItems.find(st => !completedTasks.includes(st.id));
    if (nextIncomplete) {
      return nextIncomplete.text;
    }
    return "Semua materi selesai! Selamat 🎉";
  };

  // Continue to next incomplete task
  const handleContinue = () => {
    const nextIncomplete = allTickableItems.find(st => !completedTasks.includes(st.id));
    if (nextIncomplete) {
      // Find which step this subtask/subitem belongs to and expand it
      const parentStep = steps.find(s => 
        s.subTasks.some(st => 
          st.id === nextIncomplete.id || 
          (st.subItems && st.subItems.some(si => si.id === nextIncomplete.id))
        )
      );
      if (parentStep && !expandedSteps.includes(parentStep.id)) {
        setExpandedSteps([...expandedSteps, parentStep.id]);
      }
      
      // Auto toggle completion
      toggleTask(nextIncomplete.id);
    } else {
      alert("Hebat! Anda telah menyelesaikan seluruh kurikulum materi ini!");
    }
  };

  return (
    <div className="space-y-6 w-full text-slate-800" id="course-page-view-root">
      
      {/* BACK NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 border-0 cursor-pointer"
          id="course-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Workflows</span>
        </button>

        <span className="text-[10px] font-black text-slate-500 font-mono tracking-widest uppercase bg-slate-200 shadow-neu-inset-sm px-3 py-1 rounded-full">
          Mode Belajar Aktif
        </span>
      </div>

      {/* TUTORIAL HEADER VIEW */}
      <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 md:p-8 border border-[#ffffff]/40">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left Thumbnail with Overlay Play Button */}
          <div
            onClick={() => onPlayVideo?.(item)}
            className="relative w-full lg:w-[320px] aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-neu-flat shrink-0 group border border-slate-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-[8px] tracking-widest font-mono text-lime-400 font-black mb-1">
                REAL BACKEND SYSTEM
              </span>
              <h4 className="text-white font-black text-sm tracking-tight leading-snug">
                {item.title}
              </h4>
              <p className="text-[9px] text-slate-400 font-medium mt-1">
                Google AI Studio + Supabase integration
              </p>

              {/* Decorative Connections Grid */}
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
                <span className="w-5 h-5 bg-[#e2e8f0]/10 rounded-full flex items-center justify-center text-[7px] text-white">G</span>
                <span className="w-3 h-0.5 bg-lime-400/50" />
                <span className="w-5 h-5 bg-lime-400/25 rounded-full flex items-center justify-center text-[7px] text-lime-400">⚡</span>
                <span className="w-3 h-0.5 bg-emerald-400/50" />
                <span className="w-5 h-5 bg-emerald-400/25 rounded-full flex items-center justify-center text-[7px] text-emerald-400">S</span>
              </div>
            </div>

            {/* Glowing Play Overlay */}
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-350">
                <Play className="w-6 h-6 fill-red-500 text-red-500 ml-0.5" />
              </div>
            </div>
          </div>

          {/* Right Header Text */}
          <div className="text-left space-y-3 flex-1">
            {memberName === "Admin" ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-500 font-mono">KATEGORI:</span>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        onUpdateItem?.({
                          ...item,
                          category: e.target.value
                        });
                      }}
                      className="text-[11px] font-black bg-lime-400 text-slate-950 px-2.5 py-1.5 rounded-xl tracking-wider uppercase font-mono shadow-sm border border-lime-500 w-36 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-500 font-mono">JUDUL MATERI:</span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      onUpdateItem?.({
                        ...item,
                        title: e.target.value
                      });
                    }}
                    className="w-full text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase bg-[#e2e8f0] px-3 py-2.5 rounded-2xl shadow-neu-inset-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Judul Materi"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-500 font-mono">DESKRIPSI MATERI:</span>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      onUpdateItem?.({
                        ...item,
                        description: e.target.value
                      });
                    }}
                    className="w-full text-xs text-slate-700 font-medium leading-relaxed bg-[#e2e8f0] p-3 rounded-2xl shadow-neu-inset-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Deskripsi Materi"
                    rows={3}
                  />
                </div>

                {/* Optional YouTube & Gemini URL Fields for Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 font-mono">YOUTUBE VIDEO LINK (OPSIONAL):</span>
                    <input
                      type="text"
                      value={item.youtubeUrl || ""}
                      onChange={(e) => {
                        onUpdateItem?.({
                          ...item,
                          youtubeUrl: e.target.value
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#e2e8f0] shadow-neu-inset-sm border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 font-mono">GEMINI TOOL LINK (OPSIONAL):</span>
                    <input
                      type="text"
                      value={item.geminiToolUrl || ""}
                      onChange={(e) => {
                        onUpdateItem?.({
                          ...item,
                          geminiToolUrl: e.target.value
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#e2e8f0] shadow-neu-inset-sm border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono focus:outline-none"
                      placeholder="e.g. https://aistudio.google.com/..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black bg-lime-400 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider uppercase font-mono shadow-sm">
                    {item.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  {item.title}
                </h1>
                
                {item.description && (
                  <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                )}
              </>
            )}


          </div>
        </div>
      </div>

      {/* ROADMAP & RESOURCES MAIN SECTION */}
      <div className="space-y-4 text-left">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Roadmap & Resources
        </h2>

        {/* Dynamic Progress & Next Action Bar */}
        <div className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl p-6 border border-[#ffffff]/30 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
            
            {/* Round progress circle */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-[#e2e8f0] shadow-neu-flat rounded-full">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-slate-300"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-indigo-500 transition-all duration-500"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progressPercent / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-4 h-4 fill-slate-800 text-slate-800 ml-0.5" />
              </div>
            </div>

            {/* Progress Text Description */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="text-left">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block font-mono">
                    PROGRESS
                  </span>
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {progressPercent}%
                  </span>
                </div>
                
                <span className="w-px h-6 bg-slate-300 hidden sm:block" />

                <div className="text-left">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span>UP NEXT</span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[280px]">
                    {getUpNextTask()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue button & reset triggers */}
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleContinue}
              className="px-6 py-3 rounded-2xl bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-md hover:scale-102 transition-all flex items-center gap-2 border-0 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Continue</span>
              <span className="font-mono">&gt;</span>
            </button>
            <button
              onClick={handleResetProgress}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition-all bg-transparent border-0 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset progress</span>
            </button>
          </div>
        </div>

        {/* ACCORDION ROADS STEPS LIST */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isExpanded = expandedSteps.includes(step.id);
            const stepSubTasks = step.subTasks;
            
            // Calculate step completed items count
            const getStepCompletedAndTotal = () => {
              let total = 0;
              let completed = 0;
              stepSubTasks.forEach(st => {
                if (st.subItems && st.subItems.length > 0) {
                  st.subItems.forEach(si => {
                    total++;
                    if (completedTasks.includes(si.id)) completed++;
                  });
                } else {
                  total++;
                  if (completedTasks.includes(st.id)) completed++;
                }
              });
              return { completed, total };
            };

            const { completed: completedInStep, total: stepTotal } = getStepCompletedAndTotal();
            const isCompletedAll = completedInStep === stepTotal && stepTotal > 0;
            const stepRatioPercent = stepTotal > 0 ? (completedInStep / stepTotal) * 100 : 0;

            return (
              <div 
                key={step.id}
                className="bg-[#e2e8f0] shadow-neu-flat rounded-3xl overflow-hidden border border-[#ffffff]/30 transition-all duration-300"
              >
                {/* Accordion Trigger Bar */}
                <div
                  onClick={() => toggleStepExpansion(step.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 bg-transparent border-0 cursor-pointer hover:bg-slate-200/40 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    {/* Circle Number */}
                    <div className="w-9 h-9 rounded-full bg-[#e2e8f0] shadow-neu-flat border border-[#ffffff]/60 flex items-center justify-center text-xs font-black text-slate-800 shrink-0">
                      {step.id}
                    </div>

                    {memberName === "Admin" ? (
                      <div className="flex items-center gap-2.5 flex-wrap flex-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] font-bold text-slate-500 font-mono">JUDUL FASE / LANGKAH:</span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const currentRoadmap = getCurrentRoadmap();
                              const updatedRoadmap = currentRoadmap.map(s => s.id === step.id ? { ...s, title: e.target.value } : s);
                              onUpdateItem?.({
                                ...item,
                                roadmap: updatedRoadmap
                              });
                            }}
                            className="bg-[#e2e8f0] shadow-neu-inset-sm border-0 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56 md:w-72"
                            placeholder="Nama Fase/Langkah"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            showConfirm(
                              "Hapus Fase Roadmap?",
                              `Apakah Anda yakin ingin menghapus Fase "${step.title}" beserta seluruh langkah di dalamnya?`,
                              () => {
                                const currentRoadmap = getCurrentRoadmap();
                                const updatedRoadmap = currentRoadmap.filter(s => s.id !== step.id);
                                onUpdateItem?.({
                                  ...item,
                                  roadmap: updatedRoadmap
                                });
                              }
                            );
                          }}
                          className="mt-3.5 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all border-0 cursor-pointer"
                          title="Hapus Fase"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-tight flex items-center gap-2 flex-wrap">
                        <span>{step.title}</span>
                      </h3>
                    )}
                  </div>

                  {/* Right ratios status circle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        {completedInStep}/{stepTotal}
                      </span>
                      {/* Little circular ratio ring */}
                      <div className="relative w-5 h-5 flex items-center justify-center bg-[#e2e8f0] shadow-neu-inset-sm rounded-full">
                        <svg className="w-4.5 h-4.5 transform -rotate-90">
                          <circle
                            cx="9"
                            cy="9"
                            r="6"
                            className="stroke-slate-300/40"
                            strokeWidth="1.5"
                            fill="transparent"
                          />
                          <circle
                            cx="9"
                            cy="9"
                            r="6"
                            className="stroke-indigo-500 transition-all"
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 6}`}
                            strokeDashoffset={`${2 * Math.PI * 6 * (1 - stepRatioPercent / 100)}`}
                          />
                        </svg>
                        {isCompletedAll && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-indigo-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Subtasks collapse list panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden bg-slate-200/40 border-t border-slate-300"
                    >
                      <div className="p-5 space-y-4 relative">
                        {/* Connecting Line Down Left Margins of Subtasks */}
                        <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-indigo-500/15 pointer-events-none" />

                        {stepSubTasks.map((sub) => {
                          const isDone = completedTasks.includes(sub.id);
                          const isPromptHidden = hiddenPrompts[sub.id] ?? false;
                          const isCustom = sub.id.startsWith("custom-");

                          if (sub.isPrompt) {
                            const isCustomizationExpanded = expandedCustomizations[sub.id] ?? true; // expand customization by default
                            const isFinalPromptShown = shownFinalPrompts[sub.id] ?? true; // show final prompt text box by default

                            return (
                              <div key={sub.id} className="relative pl-10 space-y-2">
                                {/* Connecting Dot Indicator Left Margins */}
                                <div 
                                  onClick={() => toggleTask(sub.id)}
                                  className={`absolute left-[15px] top-4 z-10 w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer transition-all ${
                                    isDone 
                                      ? "bg-indigo-500 border-indigo-500 text-white" 
                                      : "bg-[#e2e8f0] border-slate-400 hover:border-slate-500 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3px]" />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                      {memberName === "Admin" ? (
                                        <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                                          <span className="text-[8px] font-bold text-slate-500 font-mono">JUDUL LANGKAH:</span>
                                          <input
                                            type="text"
                                            value={sub.text}
                                            onChange={(e) => {
                                              const currentRoadmap = getCurrentRoadmap();
                                              const updatedRoadmap = currentRoadmap.map(s => {
                                                return {
                                                  ...s,
                                                  subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, text: e.target.value } : st)
                                                };
                                              });
                                              onUpdateItem?.({
                                                ...item,
                                                roadmap: updatedRoadmap
                                              });
                                            }}
                                            className="bg-white/90 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 w-64 focus:outline-none"
                                            placeholder="Judul Langkah"
                                          />
                                        </div>
                                      ) : (
                                        <span className="text-xs font-bold text-slate-800">
                                          {sub.text}
                                        </span>
                                      )}
                                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono mt-3.5">
                                        PROMPT
                                      </span>
                                      {(isCustom || memberName === "Admin") && (
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono mt-3.5">
                                          {isCustom ? "CUSTOM" : "BAWAAN"}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {(isCustom || memberName === "Admin") && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showConfirm(
                                            "Hapus Prompt?",
                                            `Apakah Anda yakin ingin menghapus prompt "${sub.text}"?`,
                                            () => {
                                              handleDeleteSubTask(step.id, sub.id);
                                            }
                                          );
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-all border-0 bg-transparent cursor-pointer mt-3.5"
                                        title="Hapus prompt"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
 
                                 {/* IMMERSIVE PROMPT CARD - EXACTLY MATCHING USER REQUEST */}
                                <div className="bg-[#eef2f6] rounded-2xl border border-indigo-100 p-5 space-y-4 shadow-sm text-left relative overflow-hidden">
                                  
                                  {/* Top header row */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-50/65 pb-3">
                                    <div className="flex items-center gap-2.5 flex-1">
                                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                                        <FileText className="w-4.5 h-4.5" />
                                      </div>
                                      
                                      {memberName === "Admin" ? (
                                        <div className="text-left flex-1 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                          <div className="flex flex-col gap-0.5">
                                            <span className="text-[8px] font-bold text-slate-500 font-mono">JUDUL KARTU PROMPT:</span>
                                            <input
                                              type="text"
                                              value={sub.promptTitle || ""}
                                              onChange={(e) => {
                                                const currentRoadmap = getCurrentRoadmap();
                                                const updatedRoadmap = currentRoadmap.map(s => {
                                                  return {
                                                    ...s,
                                                    subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, promptTitle: e.target.value } : st)
                                                  };
                                                });
                                                onUpdateItem?.({
                                                  ...item,
                                                  roadmap: updatedRoadmap
                                                });
                                              }}
                                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-extrabold text-indigo-950 focus:outline-none"
                                              placeholder="Judul Kartu Prompt"
                                            />
                                          </div>
                                          <div className="flex flex-col gap-0.5">
                                            <span className="text-[8px] font-bold text-slate-500 font-mono">DESKRIPSI KARTU PROMPT:</span>
                                            <input
                                              type="text"
                                              value={sub.promptDescription || ""}
                                              onChange={(e) => {
                                                const currentRoadmap = getCurrentRoadmap();
                                                const updatedRoadmap = currentRoadmap.map(s => {
                                                  return {
                                                    ...s,
                                                    subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, promptDescription: e.target.value } : st)
                                                  };
                                                });
                                                onUpdateItem?.({
                                                  ...item,
                                                  roadmap: updatedRoadmap
                                                });
                                              }}
                                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-600 focus:outline-none"
                                              placeholder="Deskripsi Kartu Prompt"
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-left">
                                          <h4 className="text-sm font-black text-indigo-950 leading-tight">
                                            {sub.promptTitle}
                                          </h4>
                                          {sub.promptDescription && (
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                              {sub.promptDescription}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Action Button: Copy Prompt */}
                                    <button
                                      onClick={() => handleCopyPrompt(sub.id, sub)}
                                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border-0 cursor-pointer self-start sm:self-center shadow-sm ${
                                        copyFeedback[sub.id]
                                          ? "bg-emerald-500 text-white shadow-emerald-500/10"
                                          : "bg-white hover:bg-slate-50 text-indigo-600 font-extrabold border border-indigo-100"
                                      }`}
                                    >
                                      {copyFeedback[sub.id] ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Berhasil Disalin!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy Prompt</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Dynamic Customization Section */}
                                  {sub.promptVariables && sub.promptVariables.length > 0 && (
                                    <div className="bg-white/60 rounded-xl p-3.5 border border-indigo-50/80">
                                      <button
                                        onClick={() => toggleCustomization(sub.id)}
                                        className="w-full flex items-center justify-between text-indigo-600 hover:text-indigo-700 bg-transparent border-0 cursor-pointer p-0 text-left"
                                      >
                                        <span className="text-[10px] font-black tracking-wider uppercase font-mono flex items-center gap-1.5">
                                          <Sparkles className="w-3 h-3 text-indigo-500" />
                                          PROMPT VARIABLES
                                        </span>
                                        <span className="text-[10px] font-bold">
                                          {isCustomizationExpanded ? "Sembunyikan" : "Sesuaikan Variabel ✎"}
                                        </span>
                                      </button>

                                      <AnimatePresence initial={false}>
                                        {isCustomizationExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                                              {sub.promptVariables.map((v) => (
                                                <div key={v.key} className="space-y-1">
                                                  <label className="text-[10px] font-black text-slate-600 font-mono">
                                                    {v.label}
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={promptVarValues[sub.id]?.[v.key] || ""}
                                                    onChange={(e) => handlePromptVarChange(sub.id, v.key, e.target.value)}
                                                    placeholder={v.placeholder}
                                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}

                                  {/* Prompt Content Box - COLLAPSIBLE & EDITABLE AS REQUESTED */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={() => toggleShowFinalPrompt(sub.id)}
                                        className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-all bg-transparent border-0 cursor-pointer p-0 text-left flex items-center gap-1"
                                      >
                                        <span>{isFinalPromptShown ? "▼ Sembunyikan Kotak Prompt" : "► Lihat Kotak Prompt"}</span>
                                      </button>
                                    </div>

                                    <AnimatePresence initial={false}>
                                      {isFinalPromptShown && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="relative">
                                            <textarea
                                              value={getPromptTextToShow(sub)}
                                              onChange={(e) => handlePromptChange(sub.id, e.target.value)}
                                              className="w-full min-h-[160px] p-3.5 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y shadow-inner"
                                              placeholder="Edit prompt disini..."
                                            />
                                            <span className="absolute bottom-2 right-3 text-[9px] font-bold text-indigo-500 pointer-events-none font-mono bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                              Editable Prompt Box
                                            </span>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // If it contains nested subItems checklist (like "Verify Database Setup")
                          if (sub.subItems && sub.subItems.length > 0) {
                            return (
                              <div key={sub.id} className="relative pl-10 space-y-2">
                                {/* Dot Indicator Left Margins */}
                                <div className="absolute left-[15px] top-2 z-10 w-5 h-5 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center text-[10px] text-slate-500">
                                  ✓
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-slate-900 leading-relaxed block">
                                    {sub.text}
                                  </span>
                                </div>

                                {/* Nested sub checkbox items */}
                                <div className="pl-2 space-y-2">
                                  {sub.subItems.map((si) => {
                                    const isSubDone = completedTasks.includes(si.id);
                                    return (
                                      <div
                                        key={si.id}
                                        onClick={() => toggleTask(si.id)}
                                        className="flex items-center gap-3.5 py-1 cursor-pointer select-none group"
                                      >
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                                          isSubDone 
                                            ? "bg-indigo-500 border-indigo-500 text-white" 
                                            : "bg-white border-slate-400 group-hover:border-slate-500 text-transparent"
                                        }`}>
                                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                        </div>
                                        <span className={`text-xs font-bold transition-all ${
                                          isSubDone ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-slate-900"
                                        }`}>
                                          {si.text}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          // If subtask has custom linkUrl attached (with or without prompt)
                          if (sub.link) {
                            return (
                              <div 
                                key={sub.id}
                                className={`relative pl-10 pr-3.5 py-3 rounded-xl select-none transition-all flex items-center justify-between ${
                                  isDone 
                                    ? "bg-slate-300/40 text-slate-500" 
                                    : "bg-[#e2e8f0] shadow-neu-flat text-slate-800 hover:shadow-neu-inset-sm"
                                }`}
                              >
                                {/* Checkbox click toggles the task */}
                                <div 
                                  onClick={() => toggleTask(sub.id)}
                                  className={`absolute left-[15px] top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer transition-all ${
                                    isDone 
                                      ? "bg-indigo-500 border-indigo-500 text-white" 
                                      : "bg-[#e2e8f0] border-slate-400 hover:border-slate-500 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3px]" />
                                </div>

                                <div className="flex-1 flex items-center justify-between gap-4">
                                  {memberName === "Admin" ? (
                                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="text"
                                        value={sub.text}
                                        onChange={(e) => {
                                          const currentRoadmap = getCurrentRoadmap();
                                          const updatedRoadmap = currentRoadmap.map(s => {
                                            return {
                                              ...s,
                                              subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, text: e.target.value } : st)
                                            };
                                          });
                                          onUpdateItem?.({
                                            ...item,
                                            roadmap: updatedRoadmap
                                          });
                                        }}
                                        className="bg-white/90 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 flex-1 focus:outline-none"
                                        placeholder="Judul Tautan"
                                      />
                                      <input
                                        type="text"
                                        value={sub.link.text}
                                        onChange={(e) => {
                                          const currentRoadmap = getCurrentRoadmap();
                                          const updatedRoadmap = currentRoadmap.map(s => {
                                            return {
                                              ...s,
                                              subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, link: { ...st.link!, text: e.target.value } } : st)
                                            };
                                          });
                                          onUpdateItem?.({
                                            ...item,
                                            roadmap: updatedRoadmap
                                          });
                                        }}
                                        className="bg-white/90 border border-slate-300 rounded-lg px-2 py-0.5 text-[10px] font-bold text-indigo-700 w-28 focus:outline-none"
                                        placeholder="Teks Tombol"
                                      />
                                      <input
                                        type="text"
                                        value={sub.link.url}
                                        onChange={(e) => {
                                          const currentRoadmap = getCurrentRoadmap();
                                          const updatedRoadmap = currentRoadmap.map(s => {
                                            return {
                                              ...s,
                                              subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, link: { ...st.link!, url: e.target.value } } : st)
                                            };
                                          });
                                          onUpdateItem?.({
                                            ...item,
                                            roadmap: updatedRoadmap
                                          });
                                        }}
                                        className="bg-white/90 border border-slate-300 rounded-lg px-2 py-0.5 text-[10px] font-mono text-slate-600 w-44 focus:outline-none"
                                        placeholder="URL Tautan"
                                      />
                                    </div>
                                  ) : (
                                    <span className={`text-xs font-bold leading-relaxed ${isDone ? "line-through opacity-70" : ""}`}>
                                      {sub.text}
                                    </span>
                                  )}

                                  <div className="flex items-center gap-2">
                                    {memberName !== "Admin" && (
                                      <a
                                        href={sub.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black text-white transition-all flex items-center gap-1.5 border-0 cursor-pointer shadow-sm shadow-indigo-600/10 shrink-0"
                                      >
                                        <span>{sub.link.text}</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}

                                    {(isCustom || memberName === "Admin") && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showConfirm(
                                            "Hapus Tautan?",
                                            `Apakah Anda yakin ingin menghapus langkah tautan "${sub.text}"?`,
                                            () => {
                                              handleDeleteSubTask(step.id, sub.id);
                                            }
                                          );
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-all border-0 bg-transparent cursor-pointer shrink-0"
                                        title="Hapus tautan"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Default simple checkbox row
                          return (
                            <div 
                              key={sub.id}
                              onClick={() => toggleTask(sub.id)}
                              className={`relative pl-10 pr-3.5 py-3 rounded-xl cursor-pointer select-none transition-all flex items-center justify-between ${
                                isDone 
                                  ? "bg-slate-300/40 text-slate-500 hover:bg-slate-300/60" 
                                  : "bg-[#e2e8f0] shadow-neu-flat hover:shadow-neu-inset text-slate-800"
                              }`}
                            >
                              {/* Left side checkbox absolute positioned over margin lines */}
                              <div 
                                className={`absolute left-[15px] top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                  isDone 
                                    ? "bg-indigo-500 border-indigo-500 text-white" 
                                    : "bg-[#e2e8f0] border-slate-400 hover:border-slate-500 text-transparent"
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3px]" />
                              </div>

                              {memberName === "Admin" ? (
                                <div className="flex-1 pr-4" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={sub.text}
                                    onChange={(e) => {
                                      const currentRoadmap = getCurrentRoadmap();
                                      const updatedRoadmap = currentRoadmap.map(s => {
                                        return {
                                          ...s,
                                          subTasks: s.subTasks.map(st => st.id === sub.id ? { ...st, text: e.target.value } : st)
                                        };
                                      });
                                      onUpdateItem?.({
                                        ...item,
                                        roadmap: updatedRoadmap
                                      });
                                    }}
                                    className="bg-white/95 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 w-full focus:outline-none"
                                    placeholder="Judul Langkah"
                                  />
                                </div>
                              ) : (
                                <span className={`text-xs font-bold leading-relaxed ${isDone ? "line-through opacity-70" : ""}`}>
                                  {sub.text}
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 ml-2">
                                  {isDone ? "Selesai" : "Mulai"}
                                </span>

                                {(isCustom || memberName === "Admin") && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showConfirm(
                                        "Hapus Langkah?",
                                        `Apakah Anda yakin ingin menghapus langkah "${sub.text}"?`,
                                        () => {
                                          handleDeleteSubTask(step.id, sub.id);
                                        }
                                      );
                                    }}
                                    className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-all border-0 bg-transparent cursor-pointer shrink-0"
                                    title="Hapus langkah"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* BUTTON TO ADD CUSTOM LINK OR PROMPT */}
                        {memberName === "Admin" && (
                          <div className="pt-2 pl-10 flex items-center justify-start">
                            <button
                              onClick={() => {
                                setSelectedStepIdForCustom(step.id);
                                setIsCustomModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-xs font-black transition-all flex items-center gap-1.5 border border-indigo-200/50 shadow-sm cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                              <span>Tambah Langkah Baru</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {memberName === "Admin" && (
          <div className="pt-5 flex justify-center">
            <button
              type="button"
              onClick={() => {
                const currentRoadmap = getCurrentRoadmap();
                const nextId = currentRoadmap.length > 0 ? Math.max(...currentRoadmap.map(s => s.id)) + 1 : 1;
                const newStep: RoadmapStep = {
                  id: nextId,
                  title: `Fase ${nextId}: Langkah Baru`,
                  subTasks: []
                };
                const updatedRoadmap = [...currentRoadmap, newStep];
                onUpdateItem?.({
                  ...item,
                  roadmap: updatedRoadmap
                });
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md hover:scale-102 transition-all flex items-center gap-2 border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>Tambah Fase Roadmap Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* PREMIUM CUSTOM LINK / PROMPT MODAL */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomModalOpen(false)}
              className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg bg-[#e2e8f0] border border-white/45 rounded-3xl p-6 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Tambah Link / Custom Prompt</span>
                </h3>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-300 hover:bg-slate-400/40 text-slate-700 flex items-center justify-center border-0 cursor-pointer font-bold transition-all text-xs"
                >
                  ✕
                </button>
              </div>

              {/* TABS FOR ITEM TYPE SELECTION */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-300/60 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setCustomItemType("link")}
                  className={`py-2 rounded-lg text-xs font-black transition-all border-0 cursor-pointer ${
                    customItemType === "link"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Tautan Link
                </button>
                <button
                  type="button"
                  onClick={() => setCustomItemType("prompt")}
                  className={`py-2 rounded-lg text-xs font-black transition-all border-0 cursor-pointer ${
                    customItemType === "prompt"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Custom Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setCustomItemType("simple")}
                  className={`py-2 rounded-lg text-xs font-black transition-all border-0 cursor-pointer ${
                    customItemType === "simple"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Teks Biasa
                </button>
              </div>

              <form onSubmit={handleSaveCustomItem} className="space-y-4 text-slate-800">
                {/* Judul field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase block">
                    {customItemType === "simple" ? "Deskripsi Langkah / Tugas" : customItemType === "link" ? "Judul Tautan / Langkah" : "Judul Prompt"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={customItemType === "simple" ? "misal: Menyiapkan struktur berkas baru" : customItemType === "link" ? "misal: Buka Supabase, Cek Desain Figma" : "misal: Skema Database, Copywriting Naskah"}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-slate-800 placeholder-slate-400"
                  />
                </div>

                {customItemType === "link" ? (
                  /* LINK URL FIELD */
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase block">
                      Alamat URL (Link)
                    </label>
                    <input
                      type="text"
                      required
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="misal: https://supabase.com atau figma.com"
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-slate-800 placeholder-slate-400"
                    />
                  </div>
                ) : customItemType === "simple" ? null : (
                  /* PROMPT SPECIFIC FIELDS */
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase block">
                        Deskripsi Singkat (Opsional)
                      </label>
                      <input
                        type="text"
                        value={customDesc}
                        onChange={(e) => setCustomDesc(e.target.value)}
                        placeholder="misal: Generate skema tabel profil user."
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-slate-800 placeholder-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase block flex items-center justify-between">
                        <span>Variabel Kustom (Pisahkan koma)</span>
                        <span className="text-[9px] font-bold text-indigo-600 lowercase tracking-normal">Gunakan format KUNCI:Label</span>
                      </label>
                      <input
                        type="text"
                        value={customVarsInput}
                        onChange={(e) => setCustomVarsInput(e.target.value)}
                        placeholder="misal: TABLE_NAME:Nama Tabel, BUCKET:Nama Bucket"
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-slate-800 placeholder-slate-400 font-mono"
                      />
                      <span className="text-[9px] text-slate-500 block leading-tight font-medium">
                        Lalu masukkan placeholder <code className="font-mono text-indigo-600 bg-white px-1 rounded">[NAMA_VARIABEL]</code> di dalam template prompt di bawah ini agar nilainya tersinkronisasi.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase block">
                        Template Prompt
                      </label>
                      <textarea
                        required
                        value={customTemplate}
                        onChange={(e) => setCustomTemplate(e.target.value)}
                        placeholder="Tulis instruksi prompt disini. Gunakan [TABLE_NAME] atau variabel kustom lainnya yang Anda set di atas agar bisa diganti nilainya oleh input teks."
                        className="w-full min-h-[120px] p-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner text-slate-700 font-mono resize-y"
                      />
                    </div>
                  </>
                )}

                {/* Form Footer */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-300/50">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-300 text-slate-700 hover:text-slate-800 text-xs font-black transition-all border-0 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all border-0 cursor-pointer shadow-sm shadow-indigo-600/20"
                  >
                    Simpan Langkah 
                  </button>
                </div>
              </form>
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
                <Trash className="w-6 h-6" />
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
                  className={`px-4 py-2.5 rounded-xl text-white text-xs font-black transition-all border-0 cursor-pointer shadow-sm flex-1 ${
                    confirmState.confirmText.includes("Setel Ulang")
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                      : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                  }`}
                >
                  {confirmState.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
