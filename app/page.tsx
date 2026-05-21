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

// ─── INITIAL LUXURY METRICS TEMPLATE ──────────────────────────────────────────
const createDefaultSkills = (): Skill[] => [
  { id: "cockpit", name: "Cockpit Drill & Controls", description: "Safety checks, seating position, mirrors, and instrument mastery.", score: 1 },
  { id: "junctions", name: "Junctions & Emerging", description: "Approaching safely, observation, zones of vision, and turning left/right.", score: 1 },
  { id: "roundabouts", name: "Advanced Roundabouts", description: "Lane discipline, spiral roundabouts, signaling, and traffic merging.", score: 1 },
  { id: "parking", name: "Precision Parallel Parking", description: "Reversing accurately into tight spaces with absolute control.", score: 1 },
  { id: "speed", name: "Speed Awareness & Progress", description: "Adapting smoothly to road limits, hazards, and traffic flow.", score: 1 },
];

const defaultStudentsList: StudentData[] = [
  {
    id: "alex-jones-101",
    name: "Alex Jones",
    carType: "Manual (M Performance)",
    location: "Liverpool City Centre",
    lessonNotes: "Exceptional steering line control during high-density traffic maneuvers today. Work on checking the left wing mirror prior to changing positioning lane structures.",
    nextGoals: "Introduce dual-carriageway joining strategies and high-speed braking distances.",
    skills: [
      { id: "cockpit", name: "Cockpit Drill & Controls", description: "Safety checks, seating position, mirrors, and instrument mastery.", score: 5 },
      { id: "junctions", name: "Junctions & Emerging", description: "Approaching safely, observation, zones of vision, and turning left/right.", score: 3 },
      { id: "roundabouts", name: "Advanced Roundabouts", description: "Lane discipline, spiral roundabouts, signaling, and traffic merging.", score: 2 },
      { id: "parking", name: "Precision Parallel Parking", description: "Reversing accurately into tight spaces with absolute control.", score: 1 },
      { id: "speed", name: "Speed Awareness & Progress", description: "Adapting smoothly to road limits, hazards, and traffic flow.", score: 4 },
    ],
  },
];

// ─── PURE SVG PREMIUM MONOCHROME ICONS ────────────────────────────────────────
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);

const competencyLabels: { [key: number]: string } = {
  1: "Introduced",
  2: "Guided",
  3: "Prompted",
  4: "Independent",
  5: "Test Certified",
};

export default function PremiumProgressPortal() {
  const [viewMode, setViewMode] = useState<"instructor" | "pupil">("pupil");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isSharedStudent, setIsSharedStudent] = useState(false);
  
  // Luxury Live Alerts
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Elite Authentication Gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  
  const INSTRUCTOR_PIN = "0702";

  // Form Fields
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentLocation, setNewStudentLocation] = useState("Liverpool");
  const [newStudentCar, setNewStudentCar] = useState("Manual");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get("studentData");

    if (sharedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(sharedData)));
        setStudents([decodedData]);
        setActiveId(decodedData.id);
        setViewMode("pupil");
        setIsSharedStudent(true);
        return;
      } catch (e) {
        console.error("Link decryption handshake failed", e);
      }
    }

    const saved = localStorage.getItem("premium_driving_roster");
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
    
    setStudents(defaultStudentsList);
    setActiveId(defaultStudentsList[0].id);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const currentStudent = students.find((s) => s.id === activeId);

  const saveToStorage = (updatedList: StudentData[]) => {
    if (!isSharedStudent) {
      localStorage.setItem("premium_driving_roster", JSON.stringify(updatedList));
    }
  };

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
      id: `pupil-${Date.now()}`,
      name: newStudentName.trim(),
      carType: `${newStudentCar} Edition`,
      location: newStudentLocation,
      lessonNotes: "Initial diagnostics checklist ready for tracking performance parameters.",
      nextGoals: "Complete primary cockpit systems checklist and gear response calibration.",
      skills: createDefaultSkills(),
    };

    const targetList = [...students, generated];
    setStudents(targetList);
    setActiveId(generated.id);
    saveToStorage(targetList);
    setNewStudentName("");
    triggerToast(`Vault Profile Established: ${generated.name}`);
  };

  const handleCopyShareLink = () => {
    if (!currentStudent) return;
    try {
      const payloadString = btoa(encodeURIComponent(JSON.stringify(currentStudent)));
      const secureShareUrl = `${window.location.origin}${window.location.pathname}?studentData=${payloadString}`;
      
      navigator.clipboard.writeText(secureShareUrl);
      triggerToast("Telemetry link locked to clipboard. Ready to text pupil.");
    } catch (err) {
      triggerToast("Error compilation on structural manifest link maps.");
    }
  };

  const handleSaveAll = () => {
    saveToStorage(students);
    triggerToast("All metrics securely cached to local mainframe database.");
  };

  const handleViewChange = (mode: "instructor" | "pupil") => {
    if (isSharedStudent) return;
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
      triggerToast("Authentication Verified. Welcome Back Commander.");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const maxPossibleScore = currentStudent ? currentStudent.skills.length * 5 : 25;
  const currentTotalScore = currentStudent ? currentStudent.skills.reduce((sum, sk) => sum + sk.score, 0) : 5;
  const progressPercentage = Math.round((currentTotalScore / maxPossibleScore) * 100);

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-black">
      
      {/* GLOWING LUXURY BANNER ALERT */}
      <div className={`fixed top-6 right-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] z-50 flex items-center gap-3 border border-yellow-400/40 transition-all duration-500 transform ${showToast ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}>
        <span className="w-2 h-2 bg-black rounded-full animate-ping" />
        {toastMessage}
      </div>

      {/* TOP DEEP GLOW NAVIGATION ACCENT */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      {/* RENDER HEAD HEADER */}
      <header className="border-b border-zinc-900 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          
          {/* Logo Assembly */}
          <div className="flex items-center gap-3.5 group">
            <div className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-400 rounded-xl border border-zinc-700 shadow-inner group-hover:border-amber-400/40 transition-all duration-500 transform group-hover:rotate-[10deg]">
              <DashboardIcon />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-zinc-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                VELOCITY
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Elite Driving Intelligence</p>
            </div>
          </div>

          {/* Secure Interactive Switch Toggle Panels */}
          {!isSharedStudent && (
            <div className="bg-black/80 p-1.5 rounded-xl border border-zinc-800 shadow-2xl flex items-center gap-1.5">
              <button
                onClick={() => handleViewChange("instructor")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 ${
                  viewMode === "instructor" 
                    ? "bg-gradient-to-b from-amber-400 to-yellow-500 text-black shadow-[0_4px_15px_rgba(245,158,11,0.25)] font-black" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <KeyIcon /> {isUnlocked ? "Cockpit Active" : "Secure Login"}
              </button>
              <button
                onClick={() => handleViewChange("pupil")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 ${
                  viewMode === "pupil" 
                    ? "bg-gradient-to-b from-amber-400 to-yellow-500 text-black shadow-[0_4px_15px_rgba(245,158,11,0.25)] font-black" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <UserIcon /> Pupil Display
              </button>
            </div>
          )}
        </div>
      </header>

      {/* AUTH SYSTEM SLIDE DIALOG CAPTURE GRID */}
      {showPinPrompt && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-fadeIn">
          <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-8 rounded-2xl max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-5 transform transition-all scale-100">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-500/5 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 mb-1 animate-pulse">
                <LockIcon />
              </div>
              <h3 className="text-xl font-black text-zinc-100 tracking-tight">Identity Validation</h3>
              <p className="text-xs text-zinc-400">Provide the encrypted 4-digit system master code.</p>
            </div>
            
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full text-center tracking-[1.5em] font-mono text-2xl bg-black border border-zinc-800 focus:border-amber-400 rounded-xl py-3.5 text-amber-400 focus:outline-none shadow-inner transition-all duration-300 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
              {pinError && <p className="text-xs text-rose-500 text-center font-bold tracking-wide animate-shake">Access Denied. Pin Code Invalid.</p>}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button type="button" onClick={() => { setShowPinPrompt(false); setPinInput(""); setPinError(false); }} className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-800 transition-all transform active:scale-95">Cancel</button>
                <button type="submit" className="bg-gradient-to-b from-amber-400 to-yellow-500 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-95">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE CONSOLE WRAPPER */}
      <main className="max-w-6xl mx-auto px-6 py-10 transition-opacity duration-500 animate-fadeIn">
        
        {/* UPPER PANEL CONTROL CONSOLE FOR MANAGING DRIVING ROSTER */}
        {viewMode === "instructor" && !isSharedStudent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 mb-10 shadow-2xl backdrop-blur-sm transform transition-all duration-300 hover:border-zinc-700/50">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Select Live Student Dossier</label>
              <select
                value={activeId}
                onChange={(e) => setActiveId(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-zinc-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-amber-400 transition-all cursor-pointer shadow-inner"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} — [{st.location}]</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleAddNewStudent} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Inscribe New Pupil Profile</label>
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-amber-400 transition-all placeholder-zinc-600 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Transmission</label>
                <select
                  value={newStudentCar}
                  onChange={(e) => setNewStudentCar(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-zinc-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="Manual">Manual Fleet</option>
                  <option value="Automatic">Automatic Fleet</option>
                </select>
              </div>
              <button type="submit" className="bg-zinc-800 hover:bg-amber-400 hover:text-black border border-zinc-700 text-zinc-200 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 shadow-md">
                <PlusIcon /> Initialize
              </button>
            </form>
          </div>
        )}

        {/* DRIVING STUDENT IDENTITY METRIC CARD */}
        {currentStudent ? (
          <div className="space-y-8">
            
            {/* MASTER PROFILE DISPLAY COCKPIT HEADER */}
            <div className="bg-gradient-to-br from-zinc-900 via-neutral-950 to-black border border-zinc-800 rounded-3xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-amber-500/10 transition-all duration-700" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-center text-3xl font-black text-amber-400 shadow-2xl transform transition-transform duration-500 group-hover:scale-105">
                  {currentStudent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tight text-white">{currentStudent.name}</h2>
                    <span className="px-3 py-1 bg-zinc-800/80 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-md border border-zinc-700 shadow-inner">
                      {currentStudent.carType}
                    </span>
                    {isSharedStudent && (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-400/20 animate-pulse">
                        Encrypted Data Live Link
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-medium tracking-wide flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Operational Radius: {currentStudent.location}, UK
                  </p>
                </div>
              </div>

              {/* ACTION COMMAND CONTROLS HUD */}
              <div className="flex flex-wrap items-center gap-4 relative z-10">
                {viewMode === "instructor" && !isSharedStudent && (
                  <button
                    onClick={handleCopyShareLink}
                    className="bg-black hover:bg-zinc-900 text-amber-400 border border-amber-400/30 font-black py-4 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl transition-all duration-300 transform active:scale-95 hover:border-amber-400"
                  >
                    <ShareIcon /> Dispatch Telemetry Link
                  </button>
                )}

                <div className="flex items-center gap-4 bg-black/60 px-5 py-4 rounded-2xl border border-zinc-800/80 min-w-[220px] shadow-inner">
                  <div className="relative w-14 h-14 flex items-center justify-center bg-zinc-900 rounded-full border-2 border-zinc-800 text-base font-black text-amber-400 shadow-xl overflow-hidden group-hover:border-amber-400/40 transition-colors duration-500">
                    <div className="absolute inset-0 bg-amber-400/5 animate-pulse" />
                    {progressPercentage}%
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Syllabus Quotient</p>
                    <p className="text-xs text-zinc-200 font-bold tracking-wide">
                      {progressPercentage === 100 ? "DVSA Test Standard Certified" : "Performance Calibration Path"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER CONTENT DIVISION ACCORDING TO USER PERMISSIONS */}
            {viewMode === "instructor" && !isSharedStudent ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* INSTRUCTOR INPUT GRID SCALE */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"> Spheroid Competency Matrices</h3>
                    <button onClick={() => setViewMode("pupil")} className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 bg-rose-500/5 px-2.5 py-1 rounded-md border border-rose-500/10">
                      <LockIcon /> Lock Terminals
                    </button>
                  </div>

                  {currentStudent.skills.map((skill) => (
                    <div key={skill.id} className="bg-gradient-to-b from-zinc-900/40 to-black border border-zinc-800/80 rounded-2xl p-6 transition-all duration-300 transform hover:translate-x-1 hover:border-zinc-700 shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-white text-base tracking-tight">{skill.name}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">{skill.description}</p>
                        </div>
                        <div className="bg-black px-3 py-1.5 rounded-xl border border-zinc-800 text-center sm:text-right min-w-[130px] shadow-inner">
                          <span className="text-[9px] block font-black text-zinc-500 uppercase tracking-widest">Calibration</span>
                          <span className="text-xs font-black text-amber-400 uppercase tracking-wide">{competencyLabels[skill.score]}</span>
                        </div>
                      </div>

                      {/* Animated Score Bar Matrix Buttons */}
                      <div className="grid grid-cols-5 gap-2 bg-black p-1.5 rounded-xl border border-zinc-900 shadow-inner">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const isCurrent = skill.score === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleScoreChange(skill.id, level)}
                              className={`py-3 text-center text-xs font-black rounded-lg transition-all duration-300 transform active:scale-95 ${
                                isCurrent 
                                  ? "bg-gradient-to-b from-amber-400 to-yellow-500 text-black font-black scale-[1.02] shadow-[0_4px_12px_rgba(245,158,11,0.2)]" 
                                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
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

                {/* LESSON SUMMARY TEXT DEBRIEF COLUMN ENTRY */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 sticky top-28 transition-all duration-300 hover:border-zinc-700/60">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3">Session Log Debrief</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Performance Analysis Statements</label>
                      <textarea
                        rows={5}
                        value={currentStudent.lessonNotes}
                        onChange={(e) => handleTextChange("lessonNotes", e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-amber-400 rounded-xl p-4 text-xs font-semibold leading-relaxed text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all resize-none shadow-inner focus:shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Next Target Benchmark Objectives</label>
                      <input
                        type="text"
                        value={currentStudent.nextGoals}
                        onChange={(e) => handleTextChange("nextGoals", e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-3.5 text-xs font-bold text-zinc-200 focus:outline-none transition-all shadow-inner"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-amber-400 hover:to-yellow-500 hover:text-black border border-zinc-700 hover:border-transparent text-zinc-200 font-black py-4 rounded-xl shadow-xl text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <SaveIcon /> Commit Cache Matrix
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* CLEAN LUXURY PUPIL SMARTPHONE PORTAL HOUSING */
              <div className="space-y-8 max-w-4xl mx-auto transition-all animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                    <span className="text-[9px] uppercase font-black tracking-widest text-amber-400 block mb-2">Master Flight Instructor Assessment</span>
                    <p className="text-xs leading-relaxed text-zinc-300 font-medium italic">"{currentStudent.lessonNotes}"</p>
                  </div>
                  <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500" />
                    <span className="text-[9px] uppercase font-black tracking-widest text-yellow-500 block mb-2">Target Milestones For Next Deployment</span>
                    <p className="text-xs font-black text-zinc-100 tracking-wide leading-relaxed">{currentStudent.nextGoals}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 tracking-wider mb-2">Syllabus Completion Index</h3>
                  {currentStudent.skills.map((skill) => {
                    const barPercent = (skill.score / 5) * 100;
                    const isPerfect = skill.score === 5;
                    return (
                      <div key={skill.id} className="bg-gradient-to-b from-zinc-900/30 to-black border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md group hover:border-zinc-700/80 transition-all duration-300">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-white text-base tracking-tight">{skill.name}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">{skill.description}</p>
                        </div>
                        <div className="w-full sm:w-auto flex items-center gap-5 min-w-[280px]">
                          <div className="flex-1 bg-black h-2 rounded-full border border-zinc-900 overflow-hidden p-[1px] shadow-inner">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                isPerfect ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-zinc-700"
                              }`} 
                              style={{ width: `${barPercent}%` }} 
                            />
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shrink-0 min-w-[115px] text-center shadow-sm transition-all duration-300 ${
                            isPerfect 
                              ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
                              : "bg-zinc-900 text-zinc-500 border-zinc-800"
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
          <div className="text-center py-16 bg-neutral-900/30 rounded-2xl border border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-black">No Active Student Records Registered in System.</div>
        )}
      </main>
    </div>
  );
}
