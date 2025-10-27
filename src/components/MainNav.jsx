import React from 'react';
import { MessageSquare, Bot, Settings, Circle, Sun, Moon } from 'lucide-react';

const tabs = [
  { key: 'chats', label: 'Chats', icon: MessageSquare },
  { key: 'status', label: 'Status', icon: Circle },
  { key: 'ai', label: 'AI', icon: Bot },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function MainNav({ activeTab, onChange, isDark, onToggleTheme }) {
  return (
    <>
      {/* Desktop vertical nav */}
      <nav className="hidden md:flex flex-col items-center gap-4 w-20 py-4 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="text-2xl font-bold text-emerald-600">✳︎</div>
        <div className="flex-1 flex flex-col items-center gap-2 mt-2">
          {tabs.map(({ key, icon: Icon, label }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  active
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                title={label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
        <button
          onClick={onToggleTheme}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/70">
        <div className="grid grid-cols-4">
          {tabs.map(({ key, icon: Icon, label }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`flex flex-col items-center justify-center py-2 text-xs ${
                  active
                    ? 'text-emerald-600'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
