import React, { useState } from "react";
import { Star, X, Sparkles, Edit3, Check, Heart, Bookmark, Compass } from "lucide-react";
import { AMMUVERSE_CONFIG, MemoryItem } from "../config/ammuverseConfig";
import { playStarSparkle } from "../utils/soundEffects";

interface MemoryGalaxyModalProps {
  onClose: () => void;
  isMuted: boolean;
}

export const MemoryGalaxyModal: React.FC<MemoryGalaxyModalProps> = ({
  onClose,
  isMuted,
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("ammuverse_custom_memories");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return AMMUVERSE_CONFIG.memoryGalaxy.memories;
  });

  const [activeId, setActiveId] = useState<string>(memories[0]?.id || "mem-1");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editSnippet, setEditSnippet] = useState<string>("");

  const activeMemory = memories.find((m) => m.id === activeId) || memories[0];

  const handleSelectStar = (id: string) => {
    setActiveId(id);
    playStarSparkle(isMuted);
    setIsEditing(false);
  };

  const startEdit = () => {
    if (!activeMemory) return;
    setEditTitle(activeMemory.title);
    setEditSnippet(activeMemory.snippet);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updated = memories.map((m) =>
      m.id === activeId
        ? {
            ...m,
            title: editTitle.trim() || m.title,
            snippet: editSnippet.trim() || m.snippet,
            isDraftPlaceholder: false, // User customized it!
          }
        : m
    );
    setMemories(updated);
    try {
      localStorage.setItem("ammuverse_custom_memories", JSON.stringify(updated));
    } catch {
      // safe
    }
    setIsEditing(false);
    playStarSparkle(isMuted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-xl max-h-[92dvh] rounded-3xl glass-panel-luxury p-4 sm:p-6 shadow-2xl border-2 border-pink-300/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Memory Galaxy"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-rose-900 hover:bg-pink-200 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1 pb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-3 py-0.5 text-xs font-semibold text-pink-700 mb-1">
            <Sparkles className="h-3 w-3 text-pink-500" />
            <span>Constellation II</span>
          </div>
          <h2
            id="memory-title"
            className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-rose-950 tracking-tight"
          >
            {AMMUVERSE_CONFIG.memoryGalaxy.title}
          </h2>
          <p className="font-serif-luxury text-xs sm:text-sm italic text-rose-800/80">
            {AMMUVERSE_CONFIG.memoryGalaxy.subtitle}
          </p>
        </div>

        {/* Interactive Constellation Orbit Diagram */}
        <div className="relative flex items-center justify-center py-1 sm:py-2">
          {/* Celestial orbit circle with 3 keepsakes */}
          <div className="relative flex h-20 sm:h-22 w-full max-w-xs items-center justify-around rounded-full border border-dashed border-pink-300/60 bg-pink-50/30 px-3">
            {memories.map((mem, idx) => {
              const isSelected = mem.id === activeId;
              const isFuture = mem.isFutureMemory;
              return (
                <button
                  key={mem.id}
                  onClick={() => handleSelectStar(mem.id)}
                  aria-label={`Select keepsake ${idx + 1}: ${mem.title}`}
                  className={`group relative flex flex-col items-center transition-transform ${
                    isSelected ? "scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected
                        ? isFuture
                          ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-400/50 ring-4 ring-emerald-200"
                          : "bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-pink-400/50 ring-4 ring-pink-200"
                        : "bg-white/90 border border-pink-200 text-rose-700"
                    }`}
                  >
                    {isFuture ? (
                      <Compass
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          isSelected ? "text-white animate-spin-slow" : "text-emerald-700"
                        }`}
                      />
                    ) : (
                      <Star
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          isSelected ? "fill-yellow-200 text-yellow-100 animate-pulse" : "fill-pink-100"
                        }`}
                      />
                    )}
                  </div>
                  <span className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-wide text-rose-900 truncate max-w-[80px]">
                    {isFuture ? "Future Star" : `Memory #${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Handwritten Parchment Memory Keepsake Card */}
        <div className="relative mt-2 flex-1 rounded-2xl border border-rose-200 bg-[#FFFDF9] p-4 sm:p-5 shadow-md flex flex-col justify-between">
          {/* Washi Tape Header Tag */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-28 rounded bg-rose-200/80 border border-rose-300/80 shadow-xs flex items-center justify-center">
            <span className="text-[9px] font-mono tracking-widest text-rose-800 uppercase font-bold">
              {activeMemory.isFutureMemory ? "Future Promise" : "Real Keepsake"}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {activeMemory.isFutureMemory ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px]">
                    <Compass className="h-3 w-3 text-emerald-600" />
                    <span>{activeMemory.dateTag || "An Adventure Ahead"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md text-[10px]">
                    <Bookmark className="h-3 w-3 text-rose-500" />
                    <span>{activeMemory.dateTag || "Real Memory"}</span>
                  </span>
                )}
              </div>

              {/* Personalize Button */}
              <button
                onClick={isEditing ? saveEdit : startEdit}
                className="flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50/80 px-2.5 py-1 text-[11px] font-medium text-pink-700 hover:bg-pink-100 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span>Save Note</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3 w-3" />
                    <span>Personalize</span>
                  </>
                )}
              </button>
            </div>

            {/* Draft notice banner if placeholder is unedited */}
            {activeMemory.isDraftPlaceholder && !isEditing && (
              <div className="mb-2 rounded-lg bg-amber-50/90 border border-amber-200 px-2 py-1 text-[10px] text-amber-900 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                <span>[Draft note — tap Personalize to write your real shared memory]</span>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-2 mt-1">
                <div>
                  <label className="block text-[10px] font-bold text-rose-800 uppercase">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-sm text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-800 uppercase">Memory Note</label>
                  <textarea
                    rows={3}
                    value={editSnippet}
                    onChange={(e) => setEditSnippet(e.target.value)}
                    className="w-full rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            ) : (
              <div className="py-1">
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-rose-950">
                  {activeMemory.title}
                </h3>
                <p className="mt-2 font-script-magic text-xl sm:text-2xl leading-snug text-rose-800/95 font-medium">
                  &ldquo;{activeMemory.snippet}&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-rose-100 pt-2 text-[11px] text-rose-700/80">
            <span className="flex items-center gap-1 font-medium">
              <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
              For Gagana
            </span>
            <span className="italic font-serif-luxury text-xs text-rose-900">
              {activeMemory.isFutureMemory ? "Looking forward to another day" : "A cherished moment between friends"}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
