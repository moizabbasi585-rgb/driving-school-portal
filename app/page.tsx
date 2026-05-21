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
  { id: "junctions", name: "Junctions & Emerging", description: "Approaching, turning left/right, and safety checks.", score: 1 },
  { id: "roundabouts", name: "Roundabouts", description: "Lane discipline, signaling, and matching traffic flow.", score: 1 },
  { id: "parking", name: "Parallel Parking", description: "Reversing accurately into a space behind another vehicle.", score: 1 },
  { id: "emergency", name: "Emergency Stop", description: "Quick control, prompt stopping, and securing the vehicle.", score: 1 },
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
      { id: "junctions", name: "Junctions & Emerging", description: "Approaching, turning left/right, and safety checks.", score: 3 },
      { id: "roundabouts", name: "Roundabouts", description: "Lane discipline, signaling, and matching traffic flow.", score: 1 },
      { id: "parking", name: "Parallel Parking", description: "Reversing accurately into a space behind another vehicle.", score: 2 },
      { id: "emergency", name: "Emergency Stop", description: "Quick control, prompt stopping, and securing the vehicle.", score: 1 },
    ],
  },
];

// ─── PURE SVG ICONS ──────────────────────────────────────────────────────────
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 21h14"/></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);

const competencyLabels: { [key: number]: string } = {
  1: "Introduced",
  2: "Helped",
  3: "Prompted",
  4: "Independent",
  5: "Test Ready",
};

export default function PupilProgressPortal() {
  const [viewMode, setViewMode] = useState<"instructor" | "pupil">("pupil");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isSharedStudent, setIsSharedStudent] = useState(false);
  
  // Notification states
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Security Auth
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  
  // New customized instructor master PIN
  const INSTRUCTOR_PIN = "0702";

  // New Student Input Fields State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentLocation, setNewStudentLocation] = useState("Liverpool");
  const [newStudentCar, setNewStudentCar] = useState("Manual");

  useEffect(() => {
    // 1. Check if URL contains shared secure query data parameter
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get("studentData");

    if (sharedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(sharedData)));
        setStudents([decodedData]);
        setActiveId(decodedData.id);
        setViewMode("pupil");
        setIsSharedStudent(true); // Total lockdown environment
        return;
      } catch (e) {
        console.error("Invalid shared token link metadata parameters", e);
      }
    }

    // 2. Otherwise load internal pipeline directory from client local storage
    const saved = localStorage.getItem("driving_school_roster");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StudentData[];
        if (parsed.length > 0) {
          setStudents(parsed);
          setActiveId(parsed[0].id);
          return;
        }
      } catch (e) { /**/ }
    }
    
    // Fallback default load
    setStudents(defaultStudentsList);
    setActiveId(defaultStudentsList[0].id);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const currentStudent = students.find((s) => s.id === activeId);

  // Persistence triggers
  const saveToStorage = (updatedList: StudentData[]) => {
    if (!isSharedStudent) {
      localStorage.setItem("driving_school_roster", JSON.stringify(updatedList));
    }
  };

  // State mutators
  const handleScoreChange = (skillId: string, score: number) => {
    const updated = students.map((s) => {
      if (s.id === activeId) {
        return {
          ...s,
          skills: s.skills.map((sk) => (sk.id === skillId ? { ...sk, score } : sk)),
        };
      }
      return s;
    });
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
    setStudents(targetList);
    setActiveId(generated.id);
    saveToStorage(targetList);
    setNewStudentName("");
    triggerToast(`Added profile record for ${generated.name}`);
  };

  // Generate URL Encoded Link
  const handleCopyShareLink = () => {
    if (!currentStudent) return;
    try {
      const payloadString = btoa(encodeURIComponent(JSON.stringify(currentStudent)));
      const secureShareUrl = `${window.location.origin}${window.location.pathname}?studentData=${payloadString}`;
      
      navigator.clipboard.writeText(secureShareUrl);
      triggerToast(`Link copied for ${currentStudent.name}! WhatsApp it to them.`);
    } catch (err) {
      triggerToast("Error building payload link URL parameter structures.");
    }
  };

  const handleSaveAll = () => {
    saveToStorage(students);
    triggerToast("Saved roster updates locally to device dashboard.");
  };

  const handleViewChange = (mode: "instructor" | "pupil") => {
    if (isSharedStudent) return; // Prevent entirely if viewing from shared student node
    if (mode === "instructor" && !isUnlocked) {
      setShowPinPrompt(true);
    } else {
      setViewMode(mode);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === INSTRUCTOR_PIN) {
      setIsUnlocked(true);
      setViewMode("instructor");
      setShowPinPrompt(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  // Calculations
  const maxPossibleScore = currentStudent ? currentStudent.skills.length * 5 : 20;
  const currentTotalScore = currentStudent ? currentStudent.skills.reduce((sum, sk) => sum + sk.score, 0) : 4;
  const progressPercentage = Math.round((currentTotalScore / maxPossibleScore) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Toast Alert Banner */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {/* Main App Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CarIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">DriveStream</h1>
              <p className="text-xs text-slate-400 font-medium">ADI Roster Manager</p>
            </div>
          </div>

          {/* Role selector hides completely if viewed on shared student target device */}
          {!isSharedStudent && (
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => handleViewChange("instructor")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "instructor" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserIcon /> {isUnlocked ? "Instructor View" : "🔓 Enter PIN"}
              </button>
              <button
                onClick={() => handleViewChange("pupil")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "pupil" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <UsersIcon /> Pupil View
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SECURE POPUP MODAL PIN OVERLAY */}
      {showPinPrompt && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mx-auto border border-amber-500/20 mb-2">
                <LockIcon />
              </div>
              <h3 className="text-lg font-bold text-white">Enter Security PIN</h3>
              <p className="text-xs text-slate-400">Passcode updated to secure 4-digit code.</p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-3 text-white focus:outline-none"
              />
              {pinError && <p className="text-xs text-rose-400 text-center font-medium">Wrong PIN. Try again.</p>}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button type="button" onClick={() => { setShowPinPrompt(false); setPinInput(""); setPinError(false); }} className="bg-slate-950 text-slate-400 py-2 rounded-xl text-sm border border-slate-800">Cancel</button>
                <button type="submit" className="bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-sm">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area Workspace */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* INSTRUCTOR WORKSPACE TOP CONTROL SUBMENU PANEL BAR */}
        {viewMode === "instructor" && !isSharedStudent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-md">
            {/* Active Switcher Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Student Profile</label>
              <select
                value={activeId}
                onChange={(e) => setActiveId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} ({st.location})</option>
                ))}
              </select>
            </div>

            {/* Quick Add Form System */}
            <form onSubmit={handleAddNewStudent} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">New Pupil Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Smith"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gearbox</label>
                <select
                  value={newStudentCar}
                  onChange={(e) => setNewStudentCar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2 text-sm focus:outline-none"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md">
                <PlusIcon /> Add Profile
              </button>
            </form>
          </div>
        )}

        {/* METRICS DASHBOARD PROFILE PRESENTATION CONTAINER */}
        {currentStudent ? (
          <>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-400 shadow-inner">
                  {currentStudent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white">{currentStudent.name}</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">{currentStudent.carType}</span>
                    {isSharedStudent && <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-400 text-xs font-semibold rounded-full border border-teal-500/20">Secure Live Share Link</span>}
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Zone coverage: {currentStudent.location}, UK</p>
                </div>
              </div>

              {/* Utility Functions (Share and Save Buttons for Instructor) */}
              <div className="flex flex-wrap items-center gap-3">
                {viewMode === "instructor" && !isSharedStudent && (
                  <button
                    onClick={handleCopyShareLink}
                    className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold py-3 px-4 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <CopyIcon /> 🔗 Copy Pupil Share Link
                  </button>
                )}

                <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 min-w-[200px]">
                  <div className="relative w-12 h-12 flex items-center justify-center bg-slate-900 rounded-full border-2 border-emerald-500/30 text-sm font-extrabold text-emerald-400">
                    {progressPercentage}%
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-0.5">Syllabus Complete</p>
                    <p className="text-xs text-slate-300 font-medium">{progressPercentage === 100 ? "Ready for Driving Test!" : "Standard Progression Track"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INNER DISPATCH LOGIC CONDITIONAL VIEWS WIREFRAME */}
            {viewMode === "instructor" && !isSharedStudent ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Grading rubric panels list */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">Syllabus Mastery Scale</h3>
                    <button onClick={() => setViewMode("pupil")} className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"><LockIcon /> Lock Dashboard</button>
                  </div>

                  {currentStudent.skills.map((skill) => (
                    <div key={skill.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                          <h4 className="font-bold text-white text-base">{skill.name}</h4>
                          <p className="text-xs text-slate-400">{skill.description}</p>
                        </div>
                        <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-right min-w-[110px]">
                          <span className="text-[10px] block font-bold text-slate-500 uppercase">Standard</span>
                          <span className="text-xs font-bold text-emerald-400">{competencyLabels[skill.score]}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const isCurrent = skill.score === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleScoreChange(skill.id, level)}
                              className={`py-2 text-center text-xs font-bold rounded-lg transition-all ${
                                isCurrent ? "bg-emerald-500 text-slate-950 font-extrabold scale-[1.01]" : "text-slate-400 hover:bg-slate-900"
                              }`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Text feedback block notes section panels */}
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-28">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Debrief Summary</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Lesson Progress Feedback</label>
                      <textarea
                        rows={4}
                        value={currentStudent.lessonNotes}
                        onChange={(e) => handleTextChange("lessonNotes", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Next Target Benchmarks</label>
                      <input
                        type="text"
                        value={currentStudent.nextGoals}
                        onChange={(e) => handleTextChange("nextGoals", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <SaveIcon /> Commit Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* PUPIL CLEAN MOBILE DISPLAY LAYOUT FRAMEWORK */
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-1">Instructor Review Statement</span>
                    <p className="text-sm leading-relaxed text-slate-300 italic">"{currentStudent.lessonNotes}"</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="text-xs uppercase font-bold tracking-wider text-teal-400 block mb-1">Targets Target For Next Session</span>
                    <p className="text-sm font-semibold text-slate-200">{currentStudent.nextGoals}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Syllabus Completion Mastery Track</h3>
                  {currentStudent.skills.map((skill) => {
                    const barPercent = (skill.score / 5) * 100;
                    return (
                      <div key={skill.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-white text-sm sm:text-base">{skill.name}</h4>
                          <p className="text-xs text-slate-400">{skill.description}</p>
                        </div>
                        <div className="w-full sm:w-auto flex items-center gap-4 min-w-[260px]">
                          <div className="flex-1 bg-slate-950 h-2 rounded-full border border-slate-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${barPercent}%` }} />
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border shrink-0 min-w-[100px] text-center ${
                            skill.score === 5 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : skill.score >= 3 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
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
          <div className="text-center py-12 text-slate-400">No active student selected. Please create one above.</div>
        )}
      </main>
    </div>
  );
}
