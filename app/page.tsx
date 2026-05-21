"use client";

import { useEffect, useState } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
  description: string;
  score: number; // 1 to 5
}

interface StudentData {
  name: string;
  carType: string;
  location: string;
  lessonNotes: string;
  nextGoals: string;
  skills: Skill[];
}

// ─── INITIAL MOCK DATA ────────────────────────────────────────────────────────
const initialSkills: Skill[] = [
  { id: "junctions", name: "Junctions & Emerging", description: "Approaching, turning left/right, and safety checks.", score: 2 },
  { id: "roundabouts", name: "Roundabouts", description: "Lane discipline, signaling, and matching traffic flow.", score: 1 },
  { id: "parking", name: "Parallel Parking", description: "Reversing accurately into a space behind another vehicle.", score: 3 },
  { id: "emergency", name: "Emergency Stop", description: "Quick control, prompt stopping, and securing the vehicle.", score: 1 },
];

const defaultStudent: StudentData = {
  name: "Alex Jones",
  carType: "Automatic",
  location: "Liverpool",
  lessonNotes: "Great clutch control progression today. Practiced smooth downshifts when approaching junctions. Need to check mirrors more consistently before signaling.",
  nextGoals: "Master spiral roundabouts and begin introducing reversing maneuvers.",
  skills: initialSkills,
};

// ─── PURE SVG ICONS (Replaces lucide-react entirely) ─────────────────────────
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 21h14"/></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const competencyLabels: { [key: number]: string } = {
  1: "Introduced",
  2: "Helped",
  3: "Prompted",
  4: "Independent",
  5: "Test Ready",
};

export default function PupilProgressPortal() {
  const [viewMode, setViewMode] = useState<"instructor" | "pupil">("instructor");
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("driving_portal_data");
    if (savedData) {
      try {
        setStudentData(JSON.parse(savedData));
      } catch (e) {
        setStudentData(defaultStudent);
      }
    } else {
      setStudentData(defaultStudent);
    }
  }, []);

  if (!studentData) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading portal...</div>;
  }

  // Calculate dynamic completion percentage
  const maxPossibleScore = studentData.skills.length * 5;
  const currentTotalScore = studentData.skills.reduce((sum, skill) => sum + skill.score, 0);
  const progressPercentage = Math.round((currentTotalScore / maxPossibleScore) * 100);

  const handleScoreChange = (skillId: string, newScore: number) => {
    const updatedSkills = studentData.skills.map((skill) =>
      skill.id === skillId ? { ...skill, score: newScore } : skill
    );
    setStudentData({ ...studentData, skills: updatedSkills });
  };

  const handleTextChange = (field: "lessonNotes" | "nextGoals", val: string) => {
    setStudentData({ ...studentData, [field]: val });
  };

  const handleSaveData = () => {
    localStorage.setItem("driving_portal_data", JSON.stringify(studentData));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Dynamic Sync Banner */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-slate-950 font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <CheckIcon /> Saved & synced live to pupil account!
        </div>
      )}

      {/* Header Utilities */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CarIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                DriveStream
              </h1>
              <p className="text-xs text-slate-400 font-medium">Premium Instructor Utility</p>
            </div>
          </div>

          {/* Toggle Role View Container */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode("instructor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "instructor"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <UserIcon /> Instructor View
            </button>
            <button
              onClick={() => setViewMode("pupil")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "pupil"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <UsersIcon /> Pupil / Parent View
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Snapshot Header Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-400 shadow-inner">
              AJ
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight text-white">{studentData.name}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                  {studentData.carType}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">Zone coverage: {studentData.location}, UK</p>
            </div>
          </div>

          {/* Large Radial/Metric Visual Progress Component */}
          <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 min-w-[240px]">
            <div className="relative w-14 h-14 flex items-center justify-center bg-slate-900 rounded-full border-2 border-slate-800">
              <span className="text-sm font-extrabold text-emerald-400">{progressPercentage}%</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-0.5">Syllabus Completion</p>
              <p className="text-sm font-medium text-slate-300">
                {progressPercentage === 100 ? "Ready for Practical Test!" : "Progressing towards test standard"}
              </p>
            </div>
          </div>
        </div>

        {/* CONDITION VIEW DISPATCHER */}
        {viewMode === "instructor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Core Competency Grade Selection Grid (Left Side) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <ClipboardIcon /> Core DVSA Progress Rubric
                </h3>
                <span className="text-xs text-slate-500 font-medium">Tap levels to calibrate competency</span>
              </div>

              {studentData.skills.map((skill) => (
                <div key={skill.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                    <div>
                      <h4 className="font-bold text-white text-base">{skill.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-md">{skill.description}</p>
                    </div>
                    <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 text-right min-w-[120px]">
                      <span className="text-xs block font-bold text-slate-500 uppercase tracking-wide">Standard</span>
                      <span className="text-xs font-bold text-emerald-400">{competencyLabels[skill.score]}</span>
                    </div>
                  </div>

                  {/* 1-5 Button Array Row */}
                  <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = skill.score === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleScoreChange(skill.id, level)}
                          className={`py-2.5 text-center text-sm font-bold rounded-lg transition-all duration-150 ${
                            isActive
                              ? "bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 shadow-md font-extrabold transform scale-[1.02]"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
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

            {/* Back-Office Notes Entry Station (Right Side) */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-28">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <TargetIcon /> Lesson Debrief Notes
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Today's Feedback Note</label>
                  <textarea
                    rows={4}
                    value={studentData.lessonNotes}
                    onChange={(e) => handleTextChange("lessonNotes", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all resize-none"
                    placeholder="Provide actionable analysis..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Next Action Targets</label>
                  <input
                    type="text"
                    value={studentData.nextGoals}
                    onChange={(e) => handleTextChange("nextGoals", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
                    placeholder="Define clear objectives..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveData}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all duration-200 group active:scale-[0.99]"
                >
                  <SaveIcon /> Save & Update Sync
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PUPIL / PARENT VIEW PREVIEW */
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Top Metrics Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-2">Latest Instructor Feedback</span>
                <p className="text-sm leading-relaxed text-slate-300 italic">"{studentData.lessonNotes}"</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md">
                <span className="text-xs uppercase font-bold tracking-wider text-teal-400 block mb-2">Target Goals For Next Session</span>
                <p className="text-sm font-semibold text-slate-200">{studentData.nextGoals}</p>
              </div>
            </div>

            {/* Gamified Skill Cards Stack */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-white mb-1">Your Detailed Mastery Syllabus</h3>
              {studentData.skills.map((skill) => {
                const percentage = (skill.score / 5) * 100;
                return (
                  <div key={skill.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">{skill.name}</h4>
                      <p className="text-xs text-slate-400">{skill.description}</p>
                    </div>

                    <div className="w-full md:w-auto flex items-center gap-4 min-w-[280px]">
                      {/* Metric visual progress bar indicators */}
                      <div className="flex-1 bg-slate-950 h-2.5 rounded-full border border-slate-800/60 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border shrink-0 min-w-[105px] text-center ${
                        skill.score === 5
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : skill.score >= 3
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
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
      </main>
    </div>
  );
}
