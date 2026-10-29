import React, { useState } from "react";
import { X, Sparkles, Heart, Copy, Check, Edit3, Bookmark } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playAngelicHarmonic, playStarSparkle } from "../utils/soundEffects";

interface SecretLetterModalProps {
  onClose: () => void;
  isMuted: boolean;
  onAwardKeepsake?: (id: "crown" | "star" | "heart") => void;
}

export const SecretLetterModal: React.FC<SecretLetterModalProps> = ({
  onClose,
  isMuted,
  onAwardKeepsake,
}) => {
  const cfg = AMMUVERSE_CONFIG.secretLetter;
  const [senderName, setSenderName] = useState<string>(() => {
    try {
      return localStorage.getItem("ammuverse_sender_name") || AMMUVERSE_CONFIG.sender.name;
    } catch {
      return AMMUVERSE_CONFIG.sender.name;
    }
  });

  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ammuverse_custom_letter");
      if (saved) return JSON.parse(saved);
    } catch {
      // safe
    }
    return cfg.bodyParagraphs;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editLetterText, setEditLetterText] = useState<string>(bodyParagraphs.join("\n\n"));
  const [isEditingSender, setIsEditingSender] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    playAngelicHarmonic(isMuted);
    onAwardKeepsake?.("heart");
  }, [isMuted, onAwardKeepsake]);

  const handleCopy = () => {
    const fullText = `${cfg.salutation}\n\n${bodyParagraphs.join(
      "\n\n"
    )}\n\n${cfg.closing}\n${senderName || "Your friend"} ♡`;

    navigator.clipboard?.writeText(fullText).then(() => {
      setCopied(true);
      playStarSparkle(isMuted);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveLetter = () => {
    const paragraphs = editLetterText
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length > 0) {
      setBodyParagraphs(paragraphs);
      try {
        localStorage.setItem("ammuverse_custom_letter", JSON.stringify(paragraphs));
      } catch {
        // safe
      }
    }
    setIsEditing(false);
    playStarSparkle(isMuted);
  };

  const handleSaveSender = () => {
    setIsEditingSender(false);
    try {
      localStorage.setItem("ammuverse_sender_name", senderName);
    } catch {
      // safe
    }
    playStarSparkle(isMuted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="letter-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-2.5 sm:p-4 bg-black/50 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-xl max-h-[94dvh] rounded-3xl bg-[#FFFDF9] p-4 sm:p-6 shadow-2xl border-2 border-rose-300/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Secret Letter"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-rose-900 hover:bg-pink-200 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Letter Ribbon & Wax Header */}
        <div className="flex items-center justify-between border-b border-rose-200/70 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
              <Heart className="h-4 w-4 fill-white" />
            </span>
            <div>
              <h2
                id="letter-title"
                className="font-serif-luxury text-xl sm:text-2xl font-bold text-rose-950 leading-tight"
              >
                {cfg.title}
              </h2>
              <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-widest">
                A Handwritten Keepsake
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mr-8">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveLetter();
                } else {
                  setEditLetterText(bodyParagraphs.join("\n\n"));
                  setIsEditing(true);
                }
              }}
              className="flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-700 hover:bg-pink-100 transition-colors"
            >
              {isEditing ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-3 w-3" />
                  <span>Personalize</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-700 hover:bg-pink-100 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Draft notice banner if placeholder is unedited */}
        {cfg.isDraftPlaceholder && !isEditing && (
          <div className="mb-2 rounded-lg bg-amber-50/90 border border-amber-200 px-2.5 py-1 text-[10px] text-amber-900 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
            <span>[Draft letter — tap Personalize to write your own heartfelt message, or edit in ammuverseConfig.ts]</span>
          </div>
        )}

        {/* Letter Scroll Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 text-rose-950 font-serif-luxury text-sm sm:text-base leading-relaxed space-y-2.5">
          <p className="font-script-magic text-2xl sm:text-3xl font-bold text-rose-900">
            {cfg.salutation}
          </p>

          {isEditing ? (
            <div>
              <label className="block text-[10px] font-bold text-rose-800 uppercase mb-1">
                Your Letter (Separate paragraphs with double enter)
              </label>
              <textarea
                rows={8}
                value={editLetterText}
                onChange={(e) => setEditLetterText(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white p-2.5 text-sm font-serif-luxury text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          ) : (
            bodyParagraphs.map((para, i) => (
              <p key={i} className="text-stone-800">
                {para}
              </p>
            ))
          )}

          {/* Letter Sign-off & Configurable Sender */}
          <div className="pt-2 border-t border-rose-100/80">
            <p className="text-sm italic text-stone-700">{cfg.closing}</p>

            <div className="mt-1 flex items-center gap-2">
              {isEditingSender ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    className="rounded border border-rose-300 bg-white px-2 py-0.5 text-xs text-rose-950 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveSender}
                    className="rounded bg-rose-600 px-2 py-0.5 text-xs text-white"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-script-magic text-2xl font-bold text-rose-800">
                    {senderName || "Your friend"} ♡
                  </span>
                  <button
                    onClick={() => setIsEditingSender(true)}
                    title="Personalize sender name"
                    className="text-[10px] text-pink-600 hover:text-pink-800 underline flex items-center gap-0.5"
                  >
                    <Edit3 className="h-2.5 w-2.5" />
                    <span>Edit Name</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wax Stamp & Footer */}
        <div className="mt-2 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 text-[10px] font-black shadow-inner">
              AMMU
            </div>
            <span className="text-[11px] italic text-rose-800/80 font-serif-luxury">
              Sealed with affection for Gagana
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:shadow transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
