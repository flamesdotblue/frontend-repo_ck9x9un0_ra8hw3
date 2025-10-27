import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowLeft, Image, Mic, Paperclip, Search, Send, CheckCheck, Phone, Video, MoreVertical, Smile } from 'lucide-react';

function Avatar({ name, color = 'bg-emerald-500' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className={`w-9 h-9 rounded-full ${color} text-white flex items-center justify-center text-xs font-semibold`}>{initials}</div>
  );
}

function MessageBubble({ m, aiMode }) {
  const isSelf = m.sender === 'me';
  const base = isSelf
    ? 'bg-emerald-600 text-white rounded-tr-none'
    : aiMode
    ? 'bg-purple-100 dark:bg-purple-900/30 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none';

  return (
    <div className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 ${base} shadow-sm`}
      >
      {m.image && (
        <div className="mb-2 overflow-hidden rounded-lg border border-black/5 dark:border-white/5">
          <img src={m.image} alt="attachment" className="w-full h-48 object-cover" />
        </div>
      )}
      {m.text && <p className="text-[15px] leading-5">{m.text}</p>}
      <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${isSelf ? 'text-emerald-50/90' : 'text-zinc-500 dark:text-zinc-400'}`}>
        <span>{m.time}</span>
        {isSelf && <CheckCheck className="w-3.5 h-3.5" />}
      </div>
    </div>
  );
}

export default function ChatWindow({ chat, messages, onBackMobile, onSendMessage, aiMode = false }) {
  const [text, setText] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const headerAccent = aiMode ? 'from-purple-600 to-fuchsia-600' : 'from-emerald-600 to-teal-600';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className={`h-1 w-full bg-gradient-to-r ${headerAccent}`} />
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
          <button onClick={onBackMobile} className="md:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar name={chat?.name || (aiMode ? 'AI Assistant' : 'Chat')} color={aiMode ? 'bg-purple-600' : chat?.color} />
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{chat?.name || (aiMode ? 'AI Assistant' : 'Chat')}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{aiMode ? 'Always here to help' : 'online'}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            {!aiMode && (
              <>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl" title="Voice call">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl" title="Video call">
                  <Video className="w-5 h-5" />
                </button>
              </>
            )}
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl" title="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl" title="More">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[url('https://images.unsplash.com/photo-1695740633675-d060b607f5c4?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjE1MDAxMzd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat/[0.1]">
        {(messages || []).map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <MessageBubble m={m} aiMode={aiMode} />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <div className="flex items-end gap-2">
          <button className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900" title="Emoji">
            <Smile className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900" title="Attach">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900" title="Image">
            <Image className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim()) {
                    onSendMessage(text.trim());
                    setText('');
                  }
                }
              }}
              placeholder={aiMode ? 'Ask anything…' : 'Type a message'}
              className="w-full resize-none max-h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            />
          </div>
          {text.trim() ? (
            <button
              onClick={() => {
                if (text.trim()) {
                  onSendMessage(text.trim());
                  setText('');
                }
              }}
              className={`p-3 rounded-xl text-white ${aiMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'} active:scale-95 transition`}
              title="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button className={`p-3 rounded-xl text-white ${aiMode ? 'bg-purple-600' : 'bg-emerald-600'}`} title="Voice">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
