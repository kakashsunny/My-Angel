import React, { useState } from "react";
import { X, Sparkles, Heart, ChevronRight, ChevronLeft, Bookmark, Check, Edit3 } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface ThreeLittleNotesModalProps {
  onClose: () => void;
  isMuted: boolean;
  onAwardKeepsake?: (id: "crown" | "star" | "heart") => void;
}

export const ThreeLittleNotesModal: React.FC<ThreeLittleNotesModalProps> = ({
  onClose,
  isMuted,
  onAwardKeepsake,
}) => {
  const cfg = AMMUVERSE_CONFIG.threeLittleNotes;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("ammuverse_custom_notes");
      if (saved) return JSON.parse(saved);
    } catch {
      // safe
    }
    return cfg.notes;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");

  const activeNote = notes[currentIdx] || notes[0];
  const isLast = currentIdx === notes.length - 1;

  const startEdit = () => {
    setEditTitle(activeNote.title);
    setEditContent(activeNote.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updated = notes.map((n: typeof activeNote, i: number) =>
      i === currentIdx
        ? {
            ...n,
            title: editTitle.trim() || n.title,
            content: editContent.trim() || n.content,
            isDraftPlaceholder: false,
          }
        : n
    );
    setNotes(updated);
    try {
      localStorage.setItem("ammuverse_custom_notes", JSON.stringify(updated));
    } catch {
      // safe
    }
    setIsEditing(false);
    playStarSparkle(isMuted);
  };

  const handleNext = () => {
    if (isEditing) {
      saveEdit();
    }

    if (isLast) {
      playMagicalChime(1.1, isMuted);
      onAwardKeepsake?.("heart");
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#F472B6", "#FB7185", "#FEF08A"],
          disableForReducedMotion: true,
        });
      } catch {
        // safe
      }
      onClose();
      return;
    }

    const next = currentIdx + 1;
    setCurrentIdx(next);
    setIsEditing(false);
    playStarSparkle(isMuted);

    if (next === notes.length - 1) {
      onAwardKeepsake?.("heart");
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((c) => c - 1);
      setIsEditing(false);
      playStarSparkle(isMuted);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-lg max-h-[92dvh] rounded-3xl bg-[#FFFDF9] p-4 sm:p-6 shadow-2xl border-2 border-rose-300/80 text-rose-950 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Three Little Notes"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-rose-900 hover:bg-pink-200 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1 pb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-3 py-0.5 text-xs font-semibold text-pink-700 mb-1">
            <Bookmark className="h-3 w-3 text-rose-500" />
            <span>Note {currentIdx + 1} of 3</span>
          </div>
          <h2
            id="notes-title"
            className="font-serif-luxury text-xl sm:text-2xl font-bold text-rose-950 tracking-tight"
          >
            {cfg.title}
          </h2>
          <p className="font-serif-luxury text-xs italic text-rose-800/80">
            {cfg.subtitle}
          </p>
        </div>

        {/* Note Pagination Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {notes.map((n: typeof activeNote, i: number) => (
            <button
              key={n.id}
              onClick={() => {
                setCurrentIdx(i);
                setIsEditing(false);
                playStarSparkle(isMuted);
              }}
              aria-label={`Jump to note ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIdx === i
                  ? "w-8 bg-rose-500 shadow-xs"
                  : "w-2 bg-pink-200 hover:bg-pink-300"
              }`}
            />
          ))}
        </div>

        {/* Active Note Card (Handcrafted Parchment Style) */}
        <div className="relative flex-1 rounded-2xl border border-rose-200/80 bg-gradient-to-b from-[#FFFDF9] to-[#FFF7F9] p-4 sm:p-5 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-rose-700/80 font-semibold mb-2">
              <span className="uppercase tracking-wider text-[10px] bg-rose-100/80 px-2 py-0.5 rounded-md">
                {activeNote.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={isEditing ? saveEdit : startEdit}
                  className="flex items-center gap-1 rounded border border-pink-200 bg-white px-2 py-0.5 text-[10px] font-medium text-pink-700 hover:bg-pink-50 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Check className="h-2.5 w-2.5 text-emerald-600" />
                      <span>Save</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-2.5 w-2.5" />
                      <span>Personalize</span>
                    </>
                  )}
                </button>

                <span className="flex items-center gap-1 font-script-magic text-base text-rose-800">
                  <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                  For Ammu
                </span>
              </div>
            </div>

            {/* Draft notice banner if placeholder is unedited */}
            {activeNote.isDraftPlaceholder && !isEditing && (
              <div className="mb-2 rounded-lg bg-amber-50/90 border border-amber-200 px-2 py-1 text-[10px] text-amber-900 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                <span>[Draft note — tap Personalize to replace with your words]</span>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-rose-800 uppercase">Topic</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded border border-rose-300 bg-white p-1.5 text-xs text-rose-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-800 uppercase">Your Words</label>
                  <textarea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded border border-rose-300 bg-white p-1.5 text-xs text-rose-950 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-rose-950 mb-2">
                  {activeNote.title}
                </h3>

                <p className="font-serif-luxury text-sm sm:text-base leading-relaxed text-stone-800 italic">
                  &ldquo;{activeNote.content}&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-700/75">
            <span>Keep this truth safe in your heart</span>
            <span className="font-script-magic text-sm font-bold text-rose-900">
              Always Princess ♡
            </span>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-1.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            <span>{isLast ? "Keep in My Heart" : "Next Truth"}</span>
            {isLast ? <Check className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
