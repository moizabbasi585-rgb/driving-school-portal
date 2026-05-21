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
              <p className="text-
