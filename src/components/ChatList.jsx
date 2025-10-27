import React, { useMemo, useState } from 'react';
import { Search, Users, Plus } from 'lucide-react';

function Avatar({ name, color = 'bg-emerald-500' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-sm font-semibold`}>{initials}</div>
  );
}

export default function ChatList({ chats, onSelectChat, activeChatId, onOpenGroupWizard }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q) return chats;
    const s = q.toLowerCase();
    return chats.filter((c) => c.name.toLowerCase().includes(s) || c.lastMessage.toLowerCase().includes(s));
  }, [q, chats]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            />
          </div>
          <button
            onClick={onOpenGroupWizard}
            className="shrink-0 p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition"
            title="New group"
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectChat(c.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              c.id === activeChatId ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Avatar name={c.name} color={c.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{c.name}</p>
                <span className="ml-auto text-xs text-zinc-400">{c.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{c.lastMessage}</p>
                {c.unread > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 h-5 text-xs rounded-full bg-emerald-600 text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile-only new chat action */}
      <div className="md:hidden p-3">
        <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-medium">
          <Plus className="w-4 h-4" /> New chat
        </button>
      </div>
    </div>
  );
}
