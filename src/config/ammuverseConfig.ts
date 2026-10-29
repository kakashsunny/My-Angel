/**
 * AMMUVERSE 2.0 — Master Configuration File
 *
 * AUTHENTIC PERSONALIZATION GUIDELINES:
 * - Single source of truth for all personalized copy, assets, memories, wishes,
 *   choices, collectibles, personal notes, secret star, and audio sync milestones.
 * - Items marked with [DRAFT - EDIT WITH YOUR REAL WORDS] are thoughtful draft templates.
 * - Real Memories vs. Future Memory: Never presents hypothetical memories as past events.
 *   Memory 3 is explicitly designated as a "Future Memory" waiting to happen.
 * - Audio is non-intrusive and completely optional (no forced autoplay).
 */

export interface MemoryItem {
  id: string;
  title: string;
  prompt: string;
  snippet: string;
  iconName?: string;
  dateTag?: string;
  isFutureMemory?: boolean; // True if this represents a future plan/adventure rather than a past event
  isDraftPlaceholder?: boolean; // True if this text is a placeholder waiting for the sender's exact memory
}

export interface CollectibleKeepsake {
  id: "crown" | "star" | "heart";
  name: string;
  description: string;
  icon: string;
}

export interface AmmuverseConfig {
  recipient: {
    fullName: string;
    nickname: string;
    titles: string[];
    birthDateDescription: string;
  };
  sender: {
    name: string;
    signOff: string;
    relationshipTag: string;
  };
  assets: {
    photoUrl: string;
    birthdaySongUrl: string;
  };
  envelopeIntro: {
    badge: string;
    envelopeTitle: string;
    subtitle: string;
    openButtonText: string;
    skipButtonText: string;
  };
  magicPathIntro: {
    headline: string;
    question: string;
    options: {
      id: "smile" | "surprise" | "emotional";
      label: string;
      sublabel: string;
      icon: string;
    }[];
    skipText: string;
  };
  collectibles: {
    title: string;
    items: CollectibleKeepsake[];
    completionMessage: string;
  };
  threeLittleNotes: {
    title: string;
    subtitle: string;
    notes: {
      id: number;
      category: string;
      title: string;
      content: string;
      isDraftPlaceholder?: boolean;
    }[];
  };
  secretStar: {
    message: string;
    hint: string;
  };
  nextAdventure: {
    title: string;
    subtitle: string;
    options: string[];
    confirmationText: string;
    footnote: string;
  };
  crownOfMagic: {
    title: string;
    headline: string;
    subheadline: string;
    wishes: {
      category: string;
      wish: string;
      icon: string;
    }[];
  };
  memoryGalaxy: {
    title: string;
    subtitle: string;
    memories: MemoryItem[];
  };
  wishingWell: {
    title: string;
    subtitle: string;
    prompt: string;
    wishes: string[];
  };
  secretLetter: {
    title: string;
    sealLabel: string;
    salutation: string;
    bodyParagraphs: string[];
    closing: string;
    signature: string;
    isDraftPlaceholder?: boolean;
  };
  birthdaySky: {
    title: string;
    subtitle: string;
    instructions: string;
    revealQuote: string;
    targetStarsCount: number;
  };
  audioSync: {
    chorusTimestamps: {
      start: number;
      end: number;
      label: string;
    }[];
  };
  finale: {
    mainTitle: string;
    subtitle: string;
    whisper: string;
    celebrationText: string;
    finalSincereMessage: string;
    replayButtonText: string;
    stayButtonText: string;
  };
}

export const AMMUVERSE_CONFIG: AmmuverseConfig = {
  // 1. RECIPIENT INFORMATION
  recipient: {
    fullName: "Gagana",
    nickname: "Ammu",
    titles: ["Princess", "Angel"],
    birthDateDescription: "A day the stars aligned for someone truly wonderful",
  },

  // 2. SENDER INFORMATION /* [DRAFT - EDIT WITH YOUR REAL WORDS] */
  sender: {
    /* [DRAFT: Replace with your name or nickname] */
    name: "Your Friend",
    /* [DRAFT: Replace with your personal sign-off] */
    signOff: "With lots of affection ♡",
    /* [DRAFT: E.g., 'Best Friend', 'Forever Friend'] */
    relationshipTag: "Best Friend",
  },

  // 3. ASSETS CONFIGURATION (Verified Authentic Files)
  assets: {
    // Verified supplied authentic portrait of Gagana
    photoUrl: "/assets/aistudio/Dreamy_Pink_Princess_Selfie_Frame_08c51e88.png",
    // Verified authentic MP3 (duration 107 seconds, size 2,351,864 bytes)
    birthdaySongUrl: "/assets/aistudio/Happy_Birthday__Princess_18c926f6.mp3",
  },

  // 4. ENVELOPE INTRO
  envelopeIntro: {
    badge: "ONE VERY SPECIAL UNIVERSE",
    envelopeTitle: "Reserved for Ammu ♡",
    subtitle: "A small digital gift made just for your birthday.",
    openButtonText: "OPEN YOUR UNIVERSE",
    skipButtonText: "Enter directly",
  },

  // 5. MAGIC PATH CHOICE (Upgrade 1: The Princess Chooses Her Magic)
  magicPathIntro: {
    headline: "Welcome to your little universe, Ammu.",
    question: "What kind of magic should we discover first?",
    options: [
      {
        id: "smile",
        label: "Make me smile",
        sublabel: "Playful wishes, sparkle touches & a hidden secret",
        icon: "smile",
      },
      {
        id: "surprise",
        label: "Surprise me",
        sublabel: "Let the cosmos pick a random constellation",
        icon: "sparkles",
      },
      {
        id: "emotional",
        label: "Make me emotional",
        sublabel: "Three quiet notes & a heartfelt keepsake letter",
        icon: "heart",
      },
    ],
    skipText: "I'll explore freely at my own pace →",
  },

  // 6. COLLECTIBLES SYSTEM (Upgrade 2: Little Pieces of Magic)
  collectibles: {
    title: "Little Pieces of Magic",
    items: [
      {
        id: "crown",
        name: "The Crown of Confidence",
        description: "Embracing your strength and shining without fear",
        icon: "crown",
      },
      {
        id: "star",
        name: "The Star of Dreams",
        description: "Reaching for everything your heart hopes for",
        icon: "star",
      },
      {
        id: "heart",
        name: "The Heart of Friendship",
        description: "Remembering that you are always valued and loved",
        icon: "heart",
      },
    ],
    completionMessage:
      "All three pieces of magic are shining together in your universe. You are truly loved, Gagana. ♡",
  },

  // 7. THREE LITTLE NOTES /* [DRAFT - EDIT WITH YOUR REAL WORDS] */
  // "Things I Hope You Never Forget" — Authentic, grounded truths
  threeLittleNotes: {
    title: "Things I Hope You Never Forget",
    subtitle: "Three quiet truths kept safe for you in the stars.",
    notes: [
      {
        id: 1,
        category: "Genuine Admiration",
        title: "Something I genuinely admire about you",
        /* [DRAFT: Replace with your own sincere observation] */
        content:
          "The genuine kindness and warmth you bring into conversations. You have an easy, welcoming presence that makes people around you feel instantly at home.",
        isDraftPlaceholder: true,
      },
      {
        id: 2,
        category: "A Sincere Wish",
        title: "Something beautiful I hope life brings you",
        /* [DRAFT: Replace with your heartfelt wish for her year] */
        content:
          "Days filled with calm certainty, genuine laughter that makes your eyes crinkle, and new adventures that leave you feeling proud of who you are becoming.",
        isDraftPlaceholder: true,
      },
      {
        id: 3,
        category: "Quiet Strength",
        title: "Something to remember whenever things feel heavy",
        /* [DRAFT: Replace with your words of support] */
        content:
          "You are stronger than any tough week you've had to navigate, and you never have to carry everything by yourself. Your friends are always in your corner.",
        isDraftPlaceholder: true,
      },
    ],
  },

  // 8. SECRET STAR (Upgrade 4: A Hidden Easter Egg)
  secretStar: {
    message:
      "Psst, Ammu… you found the secret.\n\nEven in a universe made of a thousand stars, there had to be one quiet surprise that belonged just to you.\n\nHappy birthday, Princess. ♡",
    hint: "A tiny heart star is nestled softly among the celestial clouds...",
  },

  // 9. NEXT ADVENTURE /* [DRAFT - EDIT WITH YOUR REAL WORDS] */
  // "One More Memory Waiting to Happen" (Upgrade 3)
  nextAdventure: {
    title: "One More Memory Waiting to Happen",
    subtitle: "A playful little idea for another day together.",
    /* [DRAFT: Customize with real plans or fun ideas you two have talked about] */
    options: [
      "Take a ridiculously silly photo together.",
      "Try that new cafe or dessert place we've mentioned.",
      "Plan an unforgettable day out celebrating your big milestone.",
    ],
    confirmationText: "Saved as a little idea for another day. ♡",
    footnote: "A playful selection between friends — no pressure, just pure fun whenever the moment arrives.",
  },

  // 10. CROWN OF MAGIC (Constellation 1)
  crownOfMagic: {
    title: "The Crown of Her Magic",
    headline: "To the girl who brings sunshine and smile to those around her.",
    subheadline: "A royal tribute to your strength, your smile, and your sparkle.",
    wishes: [
      {
        category: "Happiness & Peace",
        wish: "May your heart feel light, wrapped in calm days and gentle moments that make you smile effortlessly.",
        icon: "heart",
      },
      {
        category: "Quiet Confidence",
        wish: "May you always walk with certainty in who you are, knowing you are capable of everything you set your mind to.",
        icon: "sparkles",
      },
      {
        category: "Bright Horizons",
        wish: "May every door open for your ambitions, turning every quiet goal into your proudest reality.",
        icon: "star",
      },
    ],
  },

  // 11. MEMORY GALAXY /* [DRAFT - EDIT WITH YOUR REAL WORDS] */
  // Explicitly separates past genuine memories from future memories.
  memoryGalaxy: {
    title: "Our Little Memory Galaxy",
    subtitle: "Small keepsakes woven from moments, laughter, and future plans.",
    memories: [
      {
        id: "mem-1",
        title: "A simple moment that made me smile",
        prompt: "A memory that always brings warmth",
        /* [DRAFT: Replace with a real past event, conversation, or shared joke] */
        snippet:
          "The effortless way your presence brings calm and cheer to any room. You turn the most ordinary conversations into comforting memories.",
        iconName: "smile",
        dateTag: "Real Memory • Cherished Moment",
        isFutureMemory: false,
        isDraftPlaceholder: true,
      },
      {
        id: "mem-2",
        title: "Something that makes our friendship special",
        prompt: "A quality I truly appreciate in you",
        /* [DRAFT: Replace with a real quality or specific shared experience] */
        snippet:
          "Having someone who listens without judgment and makes every day feel a little lighter. I'm really grateful for our friendship.",
        iconName: "gem",
        dateTag: "Real Memory • Friendship",
        isFutureMemory: false,
        isDraftPlaceholder: true,
      },
      {
        id: "mem-3",
        title: "A memory waiting to happen",
        prompt: "An adventure we promise to share in the future",
        /* Future Memory Card: Clearly marked as an upcoming memory, never a hypothetical past event */
        snippet:
          "An unforgettable trip where we celebrate your biggest milestones, cheering for how far you've come and making memories we will talk about for years.",
        iconName: "compass",
        dateTag: "Future Promise • Adventure Ahead",
        isFutureMemory: true,
        isDraftPlaceholder: false,
      },
    ],
  },

  // 12. WISHING WELL
  wishingWell: {
    title: "The Angel's Wishing Well",
    subtitle: "Touch the luminous crystal orb to receive a blessing from the cosmos.",
    prompt: "Tap the glowing well to draw a wish, or cast your own secret wish into the stars.",
    wishes: [
      "May the things you dream about find their way to you.",
      "May you always find a reason to smile, even on ordinary days.",
      "May your future be kinder, brighter, and more beautiful than you imagine.",
      "May you never forget how much light you bring into the lives around you.",
      "May you always have the courage to become everything you dream of being.",
      "May life wrap you in soft warmth, quiet peace, and deep contentment.",
      "May every small step you take today bloom into a wondrous victory tomorrow.",
      "May joy find you in unexpected moments and stay with you all year through.",
      "May you always be surrounded by genuine souls who cherish you as you deserve.",
      "May every petal that falls today whisper a blessing of grace upon your path, Princess.",
    ],
  },

  // 13. SECRET LETTER /* [DRAFT - EDIT WITH YOUR REAL WORDS] */
  secretLetter: {
    title: "The Secret Letter",
    sealLabel: "Ammu's Sealed Scroll",
    salutation: "Dear Ammu,",
    /* [DRAFT: Tailor each paragraph with your personal words for Gagana] */
    bodyParagraphs: [
      "Happy birthday to my Princess and Angel.",
      "I hope this new chapter of your life brings you beautiful surprises, peaceful days, endless laughter, and opportunities that take you closer to your dreams.",
      "Never let the world make you forget your worth. You deserve happiness, kindness, genuine people, and all the little moments that make life feel magical.",
      "Thank you for being someone special in my world. I hope today reminds you of how much you matter.",
      "Keep smiling, keep dreaming, and keep being your wonderfully unique self.",
      "Happy birthday, Gagana.",
    ],
    closing: "With lots of affection,",
    /* [DRAFT: Sign your name] */
    signature: "Your friend ♡",
    isDraftPlaceholder: true,
  },

  // 14. BIRTHDAY SKY
  birthdaySky: {
    title: "The Birthday Sky",
    subtitle: "A private starlit canvas honoring Princess Ammu.",
    instructions: "Tap the glowing stars to illuminate the royal crown constellation.",
    revealQuote: "Some wishes are meant to be carried in your heart. May yours find their way home.",
    targetStarsCount: 7,
  },

  // 15. AUDIO SYNC MILESTONES (Verified against Happy_Birthday__Princess_18c926f6.mp3: duration 107s)
  audioSync: {
    chorusTimestamps: [
      { start: 34, end: 65, label: "First Chorus: Happy Birthday Ammu" },
      { start: 76, end: 95, label: "Second Chorus: Our Angel" },
      { start: 104, end: 126, label: "Third Chorus: Princess Shine Forever" },
    ],
  },

  // 16. MEANINGFUL FINALE (Stages A, B, and C)
  finale: {
    mainTitle: "HAPPY BIRTHDAY, AMMU",
    subtitle: "MY PRINCESS. MY ANGEL. ALWAYS SHINE.",
    whisper: "Gagana, may your world always have room for wonder.",
    celebrationText: "The universe can keep its stars. Today, we celebrate you. ♡",
    /* [DRAFT: Sincere, quiet closing birthday words] */
    finalSincereMessage:
      "No matter where life takes you, I hope you remember how deeply you are valued and cheered for. Have the happiest birthday, Ammu.",
    replayButtonText: "REPLAY CELEBRATION",
    stayButtonText: "RETURN TO UNIVERSE",
  },
};
