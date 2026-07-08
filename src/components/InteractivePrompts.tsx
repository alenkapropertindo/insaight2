import { useState, useEffect } from "react";
import { promptsData } from "../data";
import { Copy, Check, Sparkles, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function InteractivePrompts() {
  const [selectedPromptId, setSelectedPromptId] = useState(promptsData[0].id);
  const [copied, setCopied] = useState(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  const activePrompt = promptsData.find((p) => p.id === selectedPromptId) || promptsData[0];

  // Sync variables state when prompt template changes
  useEffect(() => {
    setVariables({ ...activePrompt.variables });
    setCopied(false);
  }, [selectedPromptId, activePrompt]);

  const handleInputChange = (key: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value
    }));
    setCopied(false);
  };

  // Re-generate the template script dynamically replacing variables with custom values
  const getRenderedTemplate = () => {
    let result = activePrompt.template;
    Object.entries(variables).forEach(([key, val]) => {
      // replace all instances of [key] with val
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\[${escapedKey}\\]`, "g");
      const stringVal = typeof val === "string" ? val : String(val);
      result = result.replace(regex, stringVal || `[${key}]`);
    });
    return result;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getRenderedTemplate());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
    }
  };

  return (
    <div id="workshop" className="scroll-mt-24">
      <div className="shadow-neu-flat rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden bg-[#e2e8f0]">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left panel: Prompt selection and tweak controls */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e2e8f0] shadow-neu-inset-sm text-[#7b6cff] text-xs font-semibold mb-4 border-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eksplorasi Prompt Premium</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                Playground Prompt Praktis
              </h3>
              <p className="text-sm text-slate-600">
                Ubah parameter di bawah ini untuk melihat bagaimana Prompt AI Premium bekerja secara langsung. Anda bisa langsung salin hasilnya kemanapun!
              </p>
            </div>

            {/* Tabs for choosing prompt */}
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block">
                Pilih Skenario Kasus:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {promptsData.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPromptId(prompt.id)}
                    className={`p-3.5 text-left rounded-2xl transition-all text-sm font-bold flex flex-col justify-between h-auto ${
                      selectedPromptId === prompt.id
                        ? "shadow-neu-inset text-[#7b6cff] bg-[#e2e8f0]"
                        : "shadow-neu-flat text-slate-700 hover:shadow-neu-inset bg-[#e2e8f0]"
                    }`}
                  >
                    <span className="text-[11px] font-bold text-[#7b6cff] uppercase tracking-wider mb-1">
                      {prompt.category}
                    </span>
                    <span className="line-clamp-1">{prompt.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic variables modifier forms */}
            <div className="p-4 rounded-3xl bg-[#e2e8f0] shadow-neu-inset space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700">
                <Sliders className="w-4 h-4 text-[#7b6cff]" />
                <span>PARAMETER PROMPT (DAPAT DISESUAIKAN)</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {Object.keys(activePrompt.variables).map((variableName) => (
                  <div key={variableName} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7b6cff]" />
                      {variableName}
                    </label>
                    <input
                      type="text"
                      value={variables[variableName] || ""}
                      onChange={(e) => handleInputChange(variableName, e.target.value)}
                      placeholder={`Kustomisasi ${variableName}...`}
                      className="w-full bg-[#e2e8f0] shadow-neu-inset-sm rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:shadow-neu-inset transition-all border-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Live rendered prompt output */}
          <div className="flex-1 flex flex-col bg-[#e2e8f0] shadow-neu-inset rounded-3xl overflow-hidden relative">
            <div className="px-5 py-3.5 border-b border-slate-300/60 flex items-center justify-between bg-[#e2e8f0]/40">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wide text-slate-500 ml-2">
                  interactive-prompt-compiler.vibe
                </span>
              </div>

              <button
                onClick={handleCopy}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copied
                    ? "shadow-neu-inset text-emerald-600 bg-[#e2e8f0]"
                    : "shadow-neu-flat text-[#7b6cff] hover:shadow-neu-inset bg-[#e2e8f0]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt description */}
            <div className="px-5 py-3 bg-[#e2e8f0] border-b border-slate-300">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold">Deskripsi Skenario:</span> {activePrompt.description}
              </p>
            </div>

            {/* The actual template rendering console */}
            <div className="flex-1 p-5 font-mono text-xs text-slate-700 leading-relaxed overflow-y-auto whitespace-pre-wrap max-h-[360px] select-all">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPromptId + "_" + JSON.stringify(variables)}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {getRenderedTemplate().split("\n").map((line, idx) => {
                    return (
                      <p key={idx} className="mb-2">
                        {line}
                      </p>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-5 py-3 bg-white/[0.02] border-t border-slate-300/60 text-[11px] text-slate-500 font-mono text-right select-none">
              total parameter: {Object.keys(activePrompt.variables).length} • UTF-8 compiled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
