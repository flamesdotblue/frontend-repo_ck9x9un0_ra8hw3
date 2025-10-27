import React, { useMemo, useState } from 'react';
import { X, ArrowRight, ArrowLeft, Users } from 'lucide-react';

const contactsSeed = [
  'Alice Johnson',
  'Bob Carter',
  'Charlotte Liu',
  'Daniel Evans',
  'Ella Fitzgerald',
  'Felix Gomez',
  'Grace Hopper',
  'Hannah Ito',
  'Ivan Petrov',
  'Jade Kim',
  'Kai Nakamura',
  'Liam O\'Brien',
  'Mia Park',
  'Noah Quinn',
  'Olivia Rivera',
  'Pablo Sanchez',
  'Quinn Taylor',
  'Riley Underwood',
  'Sofia Valdez',
  'Theo Walker',
];

export default function GroupWizard({ open, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState([]);

  const progress = (step / 4) * 100;

  const contacts = useMemo(() => {
    const arr = contactsSeed.map((n, idx) => ({ id: idx + 1, name: n }));
    if (!q) return arr;
    const s = q.toLowerCase();
    return arr.filter((c) => c.name.toLowerCase().includes(s));
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-xl border border-black/10 dark:border-white/10">
        <div className="h-1 bg-emerald-600" style={{ width: `${progress}%` }} />
        <div className="p-4 flex items-center">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Create group</h3>
          <button className="ml-auto p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-4">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">Step 1 of 4 · Add a picture</p>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-zinc-400">
                  {photo ? (
                    <img src={photo} alt="group" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="Paste image URL"
                    className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">Step 2 of 4 · Name your group</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group name"
                className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">Step 3 of 4 · Add members</p>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search contacts"
                className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-900">
                {contacts.map((c) => {
                  const isSel = selected.includes(c.id);
                  return (
                    <label key={c.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(c.id) ? prev.filter((i) => i !== c.id) : [...prev, c.id]
                          )
                        }
                      />
                      <span className="text-sm">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">Step 4 of 4 · Review</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  {photo ? (
                    <img src={photo} alt="group" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <p className="font-medium">{name || 'Unnamed group'}</p>
                  <p className="text-xs text-zinc-500">{selected.length} members</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onCreate({ name: name || 'New Group', photo, members: selected });
                setStep(1); setName(''); setPhoto(''); setQ(''); setSelected([]);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Create group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
