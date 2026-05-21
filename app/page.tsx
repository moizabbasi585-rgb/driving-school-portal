"use client";

import { useEffect, useState } from "react";
import {
  Car,
  ClipboardList,
  Save,
  User,
  Users,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  Target,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type SkillLevel = 1 | 2 | 3 | 4 | 5;

interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

interface PupilData {
  name: string;
  skills: Skill[];
  lessonNotes: string;
  nextGoals: string;
  lastUpdated: string;
}

type Role = "instructor" | "pupil";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "pupil_progress_log_v1";

const LEVEL_META: Record<
  SkillLevel,
  { label: string; color: string; bg: string; ring: string }
> = {
  1: {
    label: "Introduced",
    color: "text-slate-600",
    bg: "bg-slate-100",
    ring: "ring-slate-300",
  },
  2: {
    label: "Helped",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-300",
  },
  3: {
    label: "Prompted",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-300",
  },
  4: {
    label: "Independent",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-300",
  },
  5: {
    label: "Test Ready",
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-400",
  },
};

const DEFAULT_DATA: PupilData = {
  name: "Alex Jones",
  skills: [
    { id: "junctions", name: "Junctions & Emerging", level: 2 },
    { id: "roundabouts", name: "Roundabouts", level: 1 },
    { id: "parallel", name: "Parallel Parking", level: 3 },
    { id: "emergency", name: "Emergency Stop", level: 4 },
  ],
  lessonNotes:
    "Alex showed great improvement on parallel parking today. Mirror checks are consistent. Needs more confidence at busy junctions.",
  nextGoals:
    "Practice emerging at T-junctions in the town centre. Revisit roundabout lane discipline.",
  lastUpdated: new Date().toISOString(),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcCompletion(skills: Skill[]): number {
  const max = skills.length * 5;
  const total = skills.reduce((sum, s) => sum + s.level, 0);
  return Math.round((total / max) * 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressRing({
  pct,
  size = 160,
}: {
  pct: number;
  size?: number;
}) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color =
    pct >= 80
      ? "#7c3aed"
      : pct >= 50
      ? "#059669"
      : pct >= 25
      ? "#d97706"
      : "#64748b";

  return (
    <svg width={size} height={size} className="drop-shadow-md">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={12}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.2}
        fontWeight="700"
        fill={color}
      >
        {pct}%
      </text>
      <text
        x="50%"
        y="65%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.09}
        fill="#94a3b8"
      >
        complete
      </text>
    </svg>
  );
}

function LevelBadge({ level }: { level: SkillLevel }) {
  const m = LEVEL_META[level];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${m.bg} ${m.color} ${m.ring}`}
    >
      {level === 5 ? (
        <CheckCircle2 size={12} />
      ) : (
        <Circle size={12} />
      )}
      {level} — {m.label}
    </span>
  );
}

// ─── Instructor View ──────────────────────────────────────────────────────────

function InstructorView({
  data,
  onSave,
}: {
  data: PupilData;
  onSave: (d: PupilData) => void;
}) {
  const [draft, setDraft] = useState<PupilData>(() =>
    JSON.parse(JSON.stringify(data))
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const setLevel = (id: string, level: SkillLevel) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const updated = { ...draft, lastUpdated: new Date().toISOString() };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const completion = calcCompletion(draft.skills);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm font-medium">Current Pupil</p>
            <h2 className="text-2xl font-bold mt-0.5">{draft.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-xs">Syllabus Completion</p>
            <p className="text-4xl font-black">{completion}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-white transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Skill scoring */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ClipboardList size={18} className="text-violet-600" />
          <h3 className="font-semibold text-slate-800">DVSA Skill Scores</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {draft.skills.map((skill) => (
            <div key={skill.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">
                  {skill.name}
                </span>
                <LevelBadge level={skill.level} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => {
                  const m = LEVEL_META[lvl];
                  const active = skill.level === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(skill.id, lvl)}
                      className={`flex-1 min-w-[52px] rounded-xl py-2 text-xs font-semibold ring-1 transition-all duration-150 ${
                        active
                          ? `${m.bg} ${m.color} ${m.ring} scale-105 shadow-sm`
                          : "bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {lvl}
                      <span className="block text-[10px] font-normal leading-tight mt-0.5 truncate px-1">
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <BookOpen size={18} className="text-violet-600" />
          <h3 className="font-semibold text-slate-800">Lesson Notes</h3>
        </div>
        <div className="px-5 py-4">
          <textarea
            rows={4}
            value={draft.lessonNotes}
            onChange={(e) =>
              setDraft((p) => ({ ...p, lessonNotes: e.target.value }))
            }
            placeholder="Add notes from today's lesson…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Target size={18} className="text-violet-600" />
          <h3 className="font-semibold text-slate-800">Next Lesson Goals</h3>
        </div>
        <div className="px-5 py-4">
          <textarea
            rows={3}
            value={draft.nextGoals}
            onChange={(e) =>
              setDraft((p) => ({ ...p, nextGoals: e.target.value }))
            }
            placeholder="What should the pupil focus on next time…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold shadow-md transition-all duration-300 ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        {saved ? (
          <>
            <CheckCircle2 size={18} />
            Saved & Synced!
          </>
        ) : (
          <>
            <Save size={18} />
            Save &amp; Sync
          </>
        )}
      </button>
    </div>
  );
}

// ─── Pupil / Parent View ──────────────────────────────────────────────────────

function PupilView({ data }: { data: PupilData }) {
  const completion = calcCompletion(data.skills);
  const label =
    completion === 100
      ? "Test Ready! 🎉"
      : completion >= 75
      ? "Great Progress"
      : completion >= 40
      ? "Building Skills"
      : "Getting Started";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-violet-100 p-6 flex flex-col items-center text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
          <User size={24} className="text-violet-600" />
        </div>
        <p className="text-slate-500 text-sm">Progress Report for</p>
        <h2 className="text-2xl font-black text-slate-800 mt-0.5">
          {data.name}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Last updated: {fmtDate(data.lastUpdated)}
        </p>
        <div className="mt-5">
          <ProgressRing pct={completion} size={160} />
        </div>
        <span className="mt-3 text-sm font-semibold text-violet-700 bg-violet-100 px-4 py-1.5 rounded-full">
          {label}
        </span>
      </div>

      {/* Skill badges */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ClipboardList size={18} className="text-violet-600" />
          <h3 className="font-semibold text-slate-800">Skill Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {data.skills.map((skill) => {
            const m = LEVEL_META[skill.level];
            const barPct = (skill.level / 5) * 100;
            return (
              <div key={skill.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {skill.name}
                  </span>
                  <LevelBadge level={skill.level} />
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      skill.level === 5
                        ? "bg-violet-500"
                        : skill.level === 4
                        ? "bg-emerald-500"
                        : skill.level === 3
                        ? "bg-amber-400"
                        : skill.level === 2
                        ? "bg-blue-400"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes from instructor */}
      {data.lessonNotes && (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BookOpen size={18} className="text-violet-600" />
            <h3 className="font-semibold text-slate-800">
              Instructor&apos;s Notes
            </h3>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              {data.lessonNotes}
            </p>
          </div>
        </div>
      )}

      {/* Next goals */}
      {data.nextGoals && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-emerald-100 flex items-center gap-2">
            <Target size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">
              Focus for Next Lesson
            </h3>
          </div>
          <div className="px-5 py-4 flex gap-3">
            <AlertCircle
              size={18}
              className="text-emerald-500 mt-0.5 shrink-0"
            />
            <p className="text-sm text-emerald-800 leading-relaxed">
              {data.nextGoals}
            </p>
          </div>
        </div>
      )}

      {/* Scale legend */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">
            DVSA Progress Scale
          </h3>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 gap-2">
          {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => {
            const m = LEVEL_META[lvl];
            return (
              <div key={lvl} className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${m.bg} ${m.color}`}
                >
                  {lvl}
                </span>
                <span className={`text-sm font-medium ${m.color}`}>
                  {m.label}
                </span>
                <ChevronRight size={12} className="text-slate-300 ml-auto" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [role, setRole] = useState<Role>("instructor");
  const [data, setData] = useState<PupilData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw) as PupilData);
      } else {
        setData(DEFAULT_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      }
    } catch {
      setData(DEFAULT_DATA);
    }
  }, []);

  // Persist to localStorage whenever data changes
  const handleSave = (updated: PupilData) => {
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      console.error("localStorage write failed");
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-violet-300 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car size={20} className="text-violet-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              DriveLog
            </span>
          </div>
          {/* Role toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setRole("instructor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === "instructor"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Users size={13} />
              Instructor
            </button>
            <button
              onClick={() => setRole("pupil")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === "pupil"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User size={13} />
              Pupil / Parent
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-4 py-6 pb-16">
        {role === "instructor" ? (
          <InstructorView data={data} onSave={handleSave} />
        ) : (
          <PupilView data={data} />
        )}
      </main>
    </div>
  );
}