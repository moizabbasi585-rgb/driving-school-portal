"use client";

import { useEffect, useState } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
  description: string;
  score: number;
}

interface StudentData {
  id: string;
  name: string;
  carType: string;
  location: string;
  lessonNotes: string;
  nextGoals: string;
  skills: Skill[];
}

// ─── INITIAL SKILLS TEMPLATE ──────────────────────────────────────────────────
const createDefaultSkills = (): Skill[] => [
  { id: "junctions",   name: "Junctions & Emerging",  description: "Approaching, turning left/right, and safety checks.",                score: 1 },
  { id: "roundabouts", name: "Roundabouts",            description: "Lane discipline, signaling, and matching traffic flow.",              score: 1 },
  { id: "parking",     name: "Parallel Parking",       description: "Reversing accurately into a space behind another vehicle.",          score: 1 },
  { id: "emergency",   name: "Emergency Stop",         description: "Quick control, prompt stopping, and securing the vehicle.",          score: 1 },
];

const defaultStudentsList: StudentData[] = [
  {
    id: "alex-jones-101",
    name: "Alex Jones",
    carType: "Automatic",
    location: "Liverpool",
    lessonNotes: "Great progression on junctions today. Keep working on mirror checks before signaling.",
    nextGoals: "Introduce spiral roundabouts next week.",
    skills: [
      { id: "junctions",   name: "Junctions & Emerging",  description: "Approaching, turning left/right, and safety checks.",       score: 3 },
      { id: "roundabouts", name: "Roundabouts",            description: "Lane discipline, signaling, and matching traffic flow.",    score: 1 },
      { id: "parking",     name: "Parallel Parking",       description: "Reversing accurately into a space behind another vehicle.",score: 2 },
      { id: "emergency",   name: "Emergency Stop",         description: "Quick control, prompt stopping, and securing the vehicle.",score: 1 },
    ],
  },
];

// ─── FAVICON INJECTOR ────────────────────────────────────────────────────────
function useCarFavicon() {
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#131316"/>
      <path d="M6 20h2m16 0h2" stroke="#d4a843" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M8 20v-2.5c0-.4.1-.8.4-1.1l2.2-2.9c.3-.4.8-.6 1.3-.6h8.2c.5 0 1 .2 1.3.6l2.2 2.9c.3.3.4.7.4 1.1V20" fill="none" stroke="#d4a843" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="10" cy="20.5" r="2" fill="#d4a843"/>
      <circle cx="22" cy="20.5" r="2" fill="#d4a843"/>
      <path d="M12.5 15.5l1.5-2.5h4l1.5 2.5" fill="none" stroke="#8c6514" stroke-width="1" stroke-linejoin="round"/>
    </svg>`;
    const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = encoded;
    document.title = "DriveStream — ADI Roster";
  }, []);
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>
  </svg>
);
const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const competencyLabels: { [key: number]: string } = {
  1: "Introduced",
  2: "Helped",
  3: "Prompted",
  4: "Independent",
  5: "Test Ready",
};

const competencyColors: { [key: number]: string } = {
  1: "text-[#5a5854] border-[#2a2a30] bg-[#1a1a1f]",
  2: "text-[#7a9bbb] border-[#1e3050] bg-[#121e2e]",
  3: "text-[#c9a84c] border-[#3d2e10] bg-[#1e1708]",
  4: "text-[#7dbf8a] border-[#1e3d24] bg-[#0e1e12]",
  5: "text-[#d4a843] border-[#4a3110] bg-[#231806]",
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function PupilProgressPortal() {
  useCarFavicon();

  const [viewMode, setViewMode]     = useState<"instructor" | "pupil">("pupil");
  const [students, setStudents]     = useState<StudentData[]>([]);
  const [activeId, setActiveId]     = useState<string>("");
  const [isSharedStudent, setIsSharedStudent] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast]       = useState(false);
  const [toastType, setToastType]       = useState<"success" | "error">("success");

  const [isUnlocked, setIsUnlocked]       = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput]           = useState("");
  const [pinError, setPinError]           = useState(false);
  const [pinShake, setPinShake]           = useState(false);

  const INSTRUCTOR_PIN = "0702";

  const [newStudentName,     setNewStudentName]     = useState("");
  const [newStudentLocation, setNewStudentLocation] = useState("Liverpool");
  const [newStudentCar,      setNewStudentCar]      = useState("Manual");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get("studentData");
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        setStudents([decoded]);
        setActiveId(decoded.id);
        setViewMode("pupil");
        setIsSharedStudent(true);
        return;
      } catch (e) { console.error("Invalid shared link", e); }
    }
    const saved = localStorage.getItem("driving_school_roster");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StudentData[];
        if (parsed.length > 0) { setStudents(parsed); setActiveId(parsed[0].id); return; }
      } catch (e) { /**/ }
    }
    setStudents(defaultStudentsList);
    setActiveId(defaultStudentsList[0].id);
  }, []);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const currentStudent = students.find((s) => s.id === activeId);

  const saveToStorage = (updatedList: StudentData[]) => {
    if (!isSharedStudent) localStorage.setItem("driving_school_roster", JSON.stringify(updatedList));
  };

  const handleScoreChange = (skillId: string, score: number) => {
    const updated = students.map((s) =>
      s.id === activeId ? { ...s, skills: s.skills.map((sk) => (sk.id === skillId ? { ...sk, score } : sk)) } : s
    );
    setStudents(updated);
  };

  const handleTextChange = (field: "lessonNotes" | "nextGoals", text: string) => {
    const updated = students.map((s) => (s.id === activeId ? { ...s, [field]: text } : s));
    setStudents(updated);
  };

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const generated: StudentData = {
      id: `student-${Date.now()}`,
      name: newStudentName.trim(),
      carType: newStudentCar,
      location: newStudentLocation,
      lessonNotes: "First lesson notes template ready to build.",
      nextGoals: "Introduce baseline vehicle cockpit drill routines.",
      skills: createDefaultSkills(),
    };
    const targetList = [...students, generated];
    setStudents(targetList); setActiveId(generated.id);
    saveToStorage(targetList); setNewStudentName("");
    triggerToast(`Profile created for ${generated.name}`);
  };

  const handleCopyShareLink = () => {
    if (!currentStudent) return;
    try {
      const payload = btoa(encodeURIComponent(JSON.stringify(currentStudent)));
      const url = `${window.location.origin}${window.location.pathname}?studentData=${payload}`;
      navigator.clipboard.writeText(url);
      triggerToast(`Share link copied for ${currentStudent.name}`);
    } catch { triggerToast("Failed to generate share link", "error"); }
  };

  const handleSaveAll = () => { saveToStorage(students); triggerToast("All changes saved"); };

  const handleViewChange = (mode: "instructor" | "pupil") => {
    if (isSharedStudent) return;
    if (mode === "instructor" && !isUnlocked) { setShowPinPrompt(true); }
    else { setViewMode(mode); }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === INSTRUCTOR_PIN) {
      setIsUnlocked(true); setViewMode("instructor");
      setShowPinPrompt(false); setPinInput(""); setPinError(false);
    } else {
      setPinError(true); setPinShake(true);
      setPinInput("");
      setTimeout(() => setPinShake(false), 500);
    }
  };

  const maxPossibleScore   = currentStudent ? currentStudent.skills.length * 5 : 20;
  const currentTotalScore  = currentStudent ? currentStudent.skills.reduce((sum, sk) => sum + sk.score, 0) : 4;
  const progressPercentage = Math.round((currentTotalScore / maxPossibleScore) * 100);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--surface-0)", color: "var(--text-primary)" }}>

      {/* Toast */}
      {showToast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium shadow-2xl"
          style={{
            background: toastType === "success" ? "var(--surface-3)" : "#2a1010",
            border: `1px solid ${toastType === "success" ? "var(--gold-600)" : "#7a1f1f"}`,
            color: toastType === "success" ? "var(--gold-300)" : "#f08080",
            animation: "var(--animate-fadeUp)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ color: toastType === "success" ? "var(--gold-400)" : "#e05050" }}>
            {toastType === "success" ? "✦" : "✕"}
          </span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(13,13,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border-mid)", color: "var(--gold-400)" }}
            >
              <CarIcon />
            </div>
            <div>
              <h1
                className="text-base font-semibold tracking-tight leading-none"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "var(--gold-300)", letterSpacing: "-0.02em" }}
              >
                DriveStream
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px", fontWeight: 500 }}>
                ADI Roster Manager
              </p>
            </div>
          </div>

          {!isSharedStudent && (
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border-subtle)" }}>
              {(["instructor", "pupil"] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleViewChange(mode)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: active ? "var(--gold-500)" : "transparent",
                      color: active ? "#0d0d0f" : "var(--text-secondary)",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {mode === "instructor" ? <><UserIcon />{isUnlocked ? "Instructor" : "Enter PIN"}</> : <><UsersIcon />Pupil View</>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* PIN Modal */}
      {showPinPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-7 space-y-6"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-mid)", animation: "var(--animate-fadeUp)" }}
          >
            <div className="text-center space-y-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border-mid)", color: "var(--gold-400)" }}
              >
                <LockIcon />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
                  Instructor Access
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Enter your 4-digit security PIN</p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="····"
                className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-xl transition-all focus:outline-none"
                style={{
                  background: "var(--surface-0)",
                  border: `1px solid ${pinError ? "#7a2020" : "var(--border-mid)"}`,
                  color: pinError ? "#f08080" : "var(--gold-300)",
                  animation: pinShake ? "var(--animate-shake)" : "none",
                  fontFamily: "monospace",
                }}
              />
              {pinError && (
                <p className="text-xs text-center" style={{ color: "#e05050" }}>Incorrect PIN — try again</p>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowPinPrompt(false); setPinInput(""); setPinError(false); }}
                  className="py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{ background: "var(--surface-3)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--gold-500)", color: "#0d0d0f" }}
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Instructor Control Bar */}
        {viewMode === "instructor" && !isSharedStudent && (
          <div
            className="rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-5"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--text-muted)" }}>
                Active Profile
              </label>
              <div className="relative">
                <select
                  value={activeId}
                  onChange={(e) => setActiveId(e.target.value)}
                  className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium pr-9 focus:outline-none transition-all"
                  style={{
                    background: "var(--surface-0)",
                    border: "1px solid var(--border-mid)",
                    color: "var(--text-primary)",
                  }}
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} — {st.location}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }}>
                  <ChevronIcon />
                </span>
              </div>
            </div>

            <form onSubmit={handleAddNewStudent} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--text-muted)" }}>New Pupil</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Smith"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-all"
                  style={{ background: "var(--surface-0)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--text-muted)" }}>Gearbox</label>
                <div className="relative">
                  <select
                    value={newStudentCar}
                    onChange={(e) => setNewStudentCar(e.target.value)}
                    className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-8 focus:outline-none"
                    style={{ background: "var(--surface-0)", border: "1px solid var(--border-mid)", color: "var(--text-primary)" }}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }}>
                    <ChevronIcon />
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--gold-500)", color: "#0d0d0f" }}
              >
                <PlusIcon /> Add
              </button>
            </form>
          </div>
        )}

        {/* Student Card */}
        {currentStudent ? (
          <>
            <div
              className="rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{
                    background: "var(--surface-3)",
                    border: "1px solid var(--border-mid)",
                    color: "var(--gold-400)",
                    fontFamily: "'DM Serif Display', serif",
                  }}
                >
                  {currentStudent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2
                      className="text-xl font-bold tracking-tight"
                      style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
                    >
                      {currentStudent.name}
                    </h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: "var(--surface-3)", color: "var(--text-secondary)", border: "1px solid var(--border-mid)" }}
                    >
                      {currentStudent.carType}
                    </span>
                    {isSharedStudent && (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "var(--surface-3)", color: "var(--gold-400)", border: "1px solid var(--gold-600)" }}
                      >
                        Live Share
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{currentStudent.location}, UK</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {viewMode === "instructor" && !isSharedStudent && (
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:brightness-110"
                    style={{ background: "var(--surface-3)", color: "var(--gold-300)", border: "1px solid var(--gold-600)" }}
                  >
                    <CopyIcon /> Copy Share Link
                  </button>
                )}

                <div
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border-subtle)" }}
                >
                  {/* Circular progress */}
                  <div className="relative w-11 h-11 shrink-0">
                    <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface-3)" strokeWidth="3" />
                      <circle
                        cx="22" cy="22" r="18" fill="none"
                        stroke="var(--gold-500)" strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 18}`}
                        strokeDashoffset={`${2 * Math.PI * 18 * (1 - progressPercentage / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                      />
                    </svg>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                      style={{ color: "var(--gold-300)" }}
                    >
                      {progressPercentage}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "9px" }}>Progress</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {progressPercentage === 100 ? "Test Ready!" : "On Track"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── INSTRUCTOR VIEW ── */}
            {viewMode === "instructor" && !isSharedStudent ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}>
                      Syllabus Mastery
                    </h3>
                    <button
                      onClick={() => setViewMode("pupil")}
                      className="flex items-center gap-1.5 text-xs font-medium transition-all hover:opacity-70"
                      style={{ color: "#c06060" }}
                    >
                      <LockIcon /> Lock
                    </button>
                  </div>

                  {currentStudent.skills.map((skill, i) => (
                    <div
                      key={skill.id}
                      className="rounded-2xl p-5"
                      style={{
                        background: "var(--surface-1)",
                        border: "1px solid var(--border-subtle)",
                        animation: `var(--animate-fadeUp)`,
                        animationDelay: `${i * 60}ms`,
                        animationFillMode: "forwards",
                        opacity: 0,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{skill.name}</h4>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{skill.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border shrink-0 ${competencyColors[skill.score]}`}
                        >
                          {competencyLabels[skill.score]}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl" style={{ background: "var(--surface-0)", border: "1px solid var(--border-subtle)" }}>
                        {[1, 2, 3, 4, 5].map((level) => {
                          const active = skill.score === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleScoreChange(skill.id, level)}
                              className="py-2 text-center text-xs font-bold rounded-lg transition-all"
                              style={{
                                background: active ? "var(--gold-500)" : "transparent",
                                color: active ? "#0d0d0f" : "var(--text-muted)",
                                border: active ? "none" : "1px solid transparent",
                                transform: active ? "scale(1.03)" : "scale(1)",
                              }}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes Panel */}
                <div>
                  <div
                    className="rounded-3xl p-6 sticky top-24 space-y-5"
                    style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
                  >
                    <h3 className="text-base font-semibold pb-3" style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif", borderBottom: "1px solid var(--border-subtle)" }}>
                      Debrief
                    </h3>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--text-muted)" }}>
                        Lesson Notes
                      </label>
                      <textarea
                        rows={4}
                        value={currentStudent.lessonNotes}
                        onChange={(e) => handleTextChange("lessonNotes", e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none transition-all"
                        style={{
                          background: "var(--surface-0)",
                          border: "1px solid var(--border-mid)",
                          color: "var(--text-secondary)",
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest block" style={{ color: "var(--text-muted)" }}>
                        Next Goals
                      </label>
                      <input
                        type="text"
                        value={currentStudent.nextGoals}
                        onChange={(e) => handleTextChange("nextGoals", e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-all"
                        style={{
                          background: "var(--surface-0)",
                          border: "1px solid var(--border-mid)",
                          color: "var(--text-secondary)",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                      style={{ background: "var(--gold-500)", color: "#0d0d0f" }}
                    >
                      <SaveIcon /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── PUPIL VIEW ── */
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--gold-400)" }}>
                      Instructor Feedback
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                      "{currentStudent.lessonNotes}"
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "#7dbf8a" }}>
                      Next Session Targets
                    </span>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{currentStudent.nextGoals}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: "var(--text-primary)", fontFamily: "'DM Serif Display', serif" }}
                  >
                    Syllabus Progress
                  </h3>
                  {currentStudent.skills.map((skill, i) => {
                    const pct = (skill.score / 5) * 100;
                    return (
                      <div
                        key={skill.id}
                        className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        style={{
                          background: "var(--surface-1)",
                          border: "1px solid var(--border-subtle)",
                          animation: `var(--animate-fadeUp)`,
                          animationDelay: `${i * 70}ms`,
                          animationFillMode: "forwards",
                          opacity: 0,
                        }}
                      >
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{skill.name}</h4>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{skill.description}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:min-w-[260px]">
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "var(--surface-0)", border: "1px solid var(--border-subtle)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: skill.score === 5
                                  ? "linear-gradient(90deg, var(--gold-500), var(--gold-300))"
                                  : skill.score >= 3
                                  ? "linear-gradient(90deg, #5a8a65, #7dbf8a)"
                                  : "var(--surface-3)",
                              }}
                            />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border shrink-0 min-w-[100px] text-center ${competencyColors[skill.score]}`}
                          >
                            {competencyLabels[skill.score]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            No student selected. Create a profile above.
          </div>
        )}
      </main>
    </div>
  );
}
