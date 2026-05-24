"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Car, BookOpen, Target, CheckCircle2, ClipboardList,
  Save, RotateCcw, ChevronRight, User, GraduationCap,
  Plus, Trash2, Loader2, AlertCircle, X,
} from "lucide-react";

// ─── Supabase Client ──────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillLevel = 1 | 2 | 3 | 4 | 5;

interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

interface Pupil {
  id: string;
  name: string;
  skills: Skill[];
  lesson_notes: string;
  next_goals: string;
  last_updated: string;
}

type ViewRole = "instructor" | "pupil";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META: Record<SkillLevel, { label: string; color: string; bg: string; ring: string }> = {
  1: { label: "Introduced",  color: "text-slate-600",   bg: "bg-slate-100",  ring: "ring-slate-300"  },
  2: { label: "Helped",      color: "text-blue-600",    bg: "bg-blue-50",    ring: "ring-blue-300"   },
  3: { label: "Prompted",    color: "text-amber-600",   bg: "bg-amber-50",   ring: "ring-amber-300"  },
  4: { label: "Independent", color: "text-violet-600",  bg: "bg-violet-50",  ring: "ring-violet-300" },
  5: { label: "Test Ready",  color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-400"},
};

const DEFAULT_SKILLS: Skill[] = [
  { id: "junctions",   name: "Junctions & Emerging", level: 2 },
  { id: "roundabouts", name: "Roundabouts",           level: 1 },
  { id: "parking",     name: "Parallel Parking",      level: 3 },
  { id: "emergency",   name: "Emergency Stop",        level: 4 },
];

function makeDefaultPupil(name: string): Pupil {
  return {
    id: `pupil-${Date.now()}`,
    name,
    skills: DEFAULT_SKILLS.map(s => ({ ...s })),
    lesson_notes: "",
    next_goals: "",
    last_updated: new Date().toISOString(),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcCompletion(skills: Skill[]): number {
  if (!skills.length) return 0;
  return Math.round((skills.reduce((a, s) => a + s.level, 0) / (skills.length * 5)) * 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function initials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ pct }: { pct: number }) {
  const r = 70, circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#8b5cf6" : pct >= 25 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="relative flex items-center justify-center w-[180px] h-[180px]">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90 absolute inset-0">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-4xl font-bold text-slate-800 leading-none">{pct}%</span>
        <span className="text-xs text-slate-500 mt-1 font-medium">Complete</span>
      </div>
    </div>
  );
}

// ─── Skill Badge ──────────────────────────────────────────────────────────────

function SkillBadge({ skill }: { skill: Skill }) {
  const m = LEVEL_META[skill.level];
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${m.bg} ring-1 ${m.ring}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${m.bg} ring-2 ${m.ring} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${m.color}`}>{skill.level}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.bg} ${m.color} ring-1 ${m.ring}`}>
        {m.label}
      </span>
    </div>
  );
}

// ─── Add Pupil Modal ──────────────────────────────────────────────────────────

function AddPupilModal({ onAdd, onClose }: { onAdd: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Add New Pupil</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <input
          autoFocus
          type="text"
          placeholder="Full name (e.g. Sarah Ali)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onAdd(name.trim())}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => name.trim() && onAdd(name.trim())}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 transition"
          >
            Add Pupil
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ pupilName, onConfirm, onClose }: { pupilName: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 w-full max-w-sm p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 ring-1 ring-red-200 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Delete Pupil?</h3>
          <p className="text-sm text-slate-500 mt-1">This will permanently remove <span className="font-semibold text-slate-700">{pupilName}</span> and all their progress data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PupilProgressLog() {
  const [role, setRole] = useState<ViewRole>("instructor");
  const [pupils, setPupils] = useState<Pupil[]>([]);
  const [activePupilId, setActivePupilId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Pupil | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Pupil | null>(null);

  const activePupil = pupils.find(p => p.id === activePupilId) ?? null;

  // ── Fetch all pupils from Supabase ──
  const fetchPupils = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("pupils")
      .select("*")
      .order("last_updated", { ascending: false });
    if (err) {
      setError("Could not load pupils. Check your Supabase config.");
    } else {
      const rows = (data ?? []) as Pupil[];
      setPupils(rows);
      if (rows.length > 0 && !activePupilId) {
        setActivePupilId(rows[0].id);
        setDraft(rows[0]);
      }
    }
    setLoading(false);
  }, [activePupilId]);

  useEffect(() => { fetchPupils(); }, []);

  // Sync draft when active pupil changes
  useEffect(() => {
    if (activePupil) setDraft({ ...activePupil, skills: activePupil.skills.map(s => ({ ...s })) });
  }, [activePupilId]);

  // ── Add Pupil ──
  const handleAddPupil = async (name: string) => {
    setShowAddModal(false);
    const newPupil = makeDefaultPupil(name);
    const { error: err } = await supabase.from("pupils").insert({
      id: newPupil.id,
      name: newPupil.name,
      skills: newPupil.skills,
      lesson_notes: newPupil.lesson_notes,
      next_goals: newPupil.next_goals,
      last_updated: newPupil.last_updated,
    });
    if (err) { setError("Failed to add pupil."); return; }
    setPupils(prev => [newPupil, ...prev]);
    setActivePupilId(newPupil.id);
    setDraft(newPupil);
  };

  // ── Delete Pupil ──
  const handleDeletePupil = async () => {
    if (!deleteTarget) return;
    const { error: err } = await supabase.from("pupils").delete().eq("id", deleteTarget.id);
    if (err) { setError("Failed to delete pupil."); setDeleteTarget(null); return; }
    const remaining = pupils.filter(p => p.id !== deleteTarget.id);
    setPupils(remaining);
    setDeleteTarget(null);
    if (activePupilId === deleteTarget.id) {
      const next = remaining[0] ?? null;
      setActivePupilId(next?.id ?? null);
      setDraft(next);
    }
  };

  // ── Save / Sync ──
  const handleSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    const updated: Pupil = { ...draft, last_updated: new Date().toISOString() };
    const { error: err } = await supabase.from("pupils").upsert({
      id: updated.id,
      name: updated.name,
      skills: updated.skills,
      lesson_notes: updated.lesson_notes,
      next_goals: updated.next_goals,
      last_updated: updated.last_updated,
    });
    setSaving(false);
    if (err) { setError("Save failed. Please try again."); return; }
    setPupils(prev => prev.map(p => p.id === updated.id ? updated : p));
    setDraft(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [draft]);

  const setSkillLevel = (id: string, level: SkillLevel) => {
    setDraft(prev => prev ? {
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, level } : s),
    } : prev);
  };

  const completion = activePupil ? calcCompletion(activePupil.skills) : 0;
  const draftCompletion = draft ? calcCompletion(draft.skills) : 0;

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Loading pupils…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Modals */}
      {showAddModal && <AddPupilModal onAdd={handleAddPupil} onClose={() => setShowAddModal(false)} />}
      {deleteTarget && <DeleteModal pupilName={deleteTarget.name} onConfirm={handleDeletePupil} onClose={() => setDeleteTarget(null)} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Pupil Progress Log</h1>
              <p className="text-xs text-slate-500">UK Driving School Portal</p>
            </div>
          </div>
          {role === "instructor" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
            >
              <Plus className="w-4 h-4" /> Add Pupil
            </button>
          )}
        </div>

        {/* Role Toggle */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["instructor", "pupil"] as ViewRole[]).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === r ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100" : "text-slate-500 hover:text-slate-700"
                }`}>
                {r === "instructor" ? <><GraduationCap className="w-4 h-4" /> Instructor View</> : <><User className="w-4 h-4" /> Pupil / Parent View</>}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 ring-1 ring-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* No pupils state */}
        {pupils.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 ring-1 ring-blue-200 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-slate-800">No pupils yet</p>
              <p className="text-sm text-slate-500 mt-1">Add your first pupil to get started.</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
              <Plus className="w-4 h-4" /> Add First Pupil
            </button>
          </div>
        )}

        {/* Pupil Selector */}
        {pupils.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">Pupils</p>
            <div className="flex flex-col gap-2">
              {pupils.map(p => {
                const pct = calcCompletion(p.skills);
                const isActive = p.id === activePupilId;
                return (
                  <div key={p.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ring-1 transition-all duration-150 ${
                      isActive ? "bg-white ring-blue-300 shadow-sm" : "bg-white/60 ring-slate-200 hover:bg-white hover:ring-slate-300"
                    }`}
                    onClick={() => { setActivePupilId(p.id); setDraft({ ...p, skills: p.skills.map(s => ({ ...s })) }); }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow ${isActive ? "bg-gradient-to-br from-blue-500 to-violet-500" : "bg-slate-400"}`}>
                      {initials(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">Updated {fmtDate(p.last_updated)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-violet-600" : "text-amber-500"}`}>{pct}%</span>
                      {role === "instructor" && (
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteTarget(p); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete pupil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Pupil Detail */}
        {activePupil && draft && (
          <>
            {/* ── INSTRUCTOR VIEW ── */}
            {role === "instructor" && (
              <>
                <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    <h2 className="font-bold text-slate-800">DVSA Skill Scores</h2>
                    <span className="ml-auto text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full ring-1 ring-blue-200">
                      {draftCompletion}% Draft
                    </span>
                  </div>
                  <div className="p-5 space-y-5">
                    {draft.skills.map(skill => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ring-1 ${LEVEL_META[skill.level].bg} ${LEVEL_META[skill.level].color} ${LEVEL_META[skill.level].ring}`}>
                            {LEVEL_META[skill.level].label}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {([1, 2, 3, 4, 5] as SkillLevel[]).map(lvl => {
                            const active = skill.level === lvl;
                            const m = LEVEL_META[lvl];
                            return (
                              <button key={lvl} onClick={() => setSkillLevel(skill.id, lvl)}
                                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-150 ring-1 ${
                                  active ? `${m.bg} ${m.color} ${m.ring} shadow-sm scale-105` : "bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100"
                                }`}>
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1 px-0.5">
                          {([1, 2, 3, 4, 5] as SkillLevel[]).map(lvl => (
                            <span key={lvl} className="flex-1 text-center text-[10px] text-slate-400">{LEVEL_META[lvl].label.split(" ")[0]}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-violet-500" />
                    <h2 className="font-bold text-slate-800">Lesson Notes & Goals</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Lesson Notes</label>
                      <textarea rows={3} value={draft.lesson_notes}
                        onChange={e => setDraft(p => p ? { ...p, lesson_notes: e.target.value } : p)}
                        placeholder="What did you cover today?"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Next Lesson Goals</label>
                      <textarea rows={2} value={draft.next_goals}
                        onChange={e => setDraft(p => p ? { ...p, next_goals: e.target.value } : p)}
                        placeholder="What to focus on next time?"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none transition" />
                    </div>
                  </div>
                </section>

                <button onClick={handleSave} disabled={saving}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                    saved ? "bg-emerald-500 text-white scale-95"
                    : saving ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
                  }`}>
                  {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
                    : saved ? <><CheckCircle2 className="w-5 h-5" /> Saved & Synced!</>
                    : <><Save className="w-5 h-5" /> Save &amp; Sync to Supabase</>}
                </button>
              </>
            )}

            {/* ── PUPIL / PARENT VIEW ── */}
            {role === "pupil" && (
              <>
                <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 flex flex-col items-center gap-4">
                  <h2 className="font-bold text-slate-800 text-lg self-start w-full flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" /> Overall Progress
                  </h2>
                  <ProgressRing pct={completion} />
                  <p className="text-sm text-slate-500 text-center max-w-xs">
                    {completion >= 80 ? "🎉 Excellent progress! You're nearly test-ready."
                      : completion >= 50 ? "📈 Great momentum — keep it up!"
                      : "🚀 Every lesson counts. You're building strong foundations."}
                  </p>
                </section>

                <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-violet-500" />
                    <h2 className="font-bold text-slate-800">Your DVSA Skills</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    {activePupil.skills.map(skill => <SkillBadge key={skill.id} skill={skill} />)}
                    <div className="mt-2 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>1 = Introduced</span><span>3 = Prompted</span><span>5 = Test Ready</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 via-amber-200 via-violet-300 to-emerald-400" />
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h2 className="font-bold text-slate-800">From Your Instructor</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Latest Lesson Notes</p>
                      <p className="text-sm text-slate-700 bg-amber-50 ring-1 ring-amber-200 rounded-xl px-4 py-3 leading-relaxed">
                        {activePupil.lesson_notes || "No notes recorded yet."}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" /> Next Lesson Goals
                      </p>
                      <p className="text-sm text-slate-700 bg-violet-50 ring-1 ring-violet-200 rounded-xl px-4 py-3 leading-relaxed">
                        {activePupil.next_goals || "No goals set yet."}
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
        Pupil Progress Log · UK Driving School Portal · Powered by Supabase
      </footer>
    </div>
  );
}
