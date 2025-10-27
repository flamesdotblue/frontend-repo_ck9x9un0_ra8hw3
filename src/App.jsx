import React, { useMemo, useState } from 'react';
import MainNav from './components/MainNav';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import GroupWizard from './components/GroupWizard';
import { ChevronLeft } from 'lucide-react';

const seedChats = [
  {
    id: 1,
    name: 'Design Team',
    color: 'bg-emerald-500',
    lastMessage: 'Mockups look great, pushing to Figma now',
    time: '2:14 PM',
    unread: 3,
  },
  {
    id: 2,
    name: 'Ava Thompson',
    color: 'bg-orange-500',
    lastMessage: 'Dinner tonight? 🍣',
    time: '1:02 PM',
    unread: 0,
  },
  {
    id: 3,
    name: 'Family',
    color: 'bg-sky-500',
    lastMessage: 'Send the photos here',
    time: 'Yesterday',
    unread: 1,
  },
];

const seedMessages = {
  1: [
    { sender: 'them', text: 'Quick standup in 5?', time: '2:01 PM' },
    { sender: 'me', text: 'Be right there!', time: '2:02 PM' },
    {
      sender: 'them',
      image:
        'https://images.unsplash.com/photo-1604014237800-1c9102c78ca9?q=80&w=1200&auto=format&fit=crop',
      text: 'New hero exploration — thoughts?',
      time: '2:10 PM',
    },
    { sender: 'me', text: 'Love this direction!', time: '2:12 PM' },
  ],
  2: [
    { sender: 'them', text: 'Dinner tonight? 🍣', time: '1:00 PM' },
    { sender: 'me', text: 'Yes! 7pm works?', time: '1:02 PM' },
  ],
  3: [
    { sender: 'them', text: 'Send the photos here', time: 'Yesterday' },
    {
      sender: 'me',
      image:
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1200&auto=format&fit=crop',
      text: 'From the hike! 🏔️',
      time: 'Yesterday',
    },
  ],
};

const seedStatuses = [
  { id: 'me', name: 'My Status', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', recent: false, mine: true },
  { id: 11, name: 'Alice Johnson', image: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?q=80&w=1200&auto=format&fit=crop', recent: true },
  { id: 12, name: 'Bob Carter', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop', recent: true },
  { id: 13, name: 'Family', image: 'https://images.unsplash.com/photo-1530041686259-53ec1b8a7d05?q=80&w=1200&auto=format&fit=crop', viewed: true },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // chats | status | ai | settings
  const [chats, setChats] = useState(seedChats);
  const [messages, setMessages] = useState(seedMessages);
  const [currentChatId, setCurrentChatId] = useState(seedChats[0].id);
  const [groupOpen, setGroupOpen] = useState(false);
  const [mobileChatsView, setMobileChatsView] = useState('list'); // list | chat
  const [statusViewer, setStatusViewer] = useState(null); // {index}

  const currentChat = useMemo(() => chats.find((c) => c.id === currentChatId), [chats, currentChatId]);

  const handleSend = (text) => {
    setMessages((prev) => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), { sender: 'me', text, time: 'Now' }],
    }));
  };

  const handleSendAI = (text) => {
    setMessages((prev) => ({
      ...prev,
      ai: [...(prev.ai || []), { sender: 'me', text, time: 'Now' }, { sender: 'them', text: 'Thinking…', time: 'Now' }],
    }));
  };

  const openChat = (id) => {
    setCurrentChatId(id);
    setActiveTab('chats');
    setMobileChatsView('chat');
    // clear unread for that chat in mock state
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const addGroup = ({ name, photo }) => {
    const newId = Math.max(...chats.map((c) => c.id)) + 1;
    const newChat = {
      id: newId,
      name,
      color: 'bg-emerald-500',
      lastMessage: 'Group created',
      time: 'Now',
      unread: 0,
      photo,
    };
    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [{ sender: 'me', text: 'Welcome to the group! 🎉', time: 'Now' }] }));
    setCurrentChatId(newId);
    setActiveTab('chats');
    setMobileChatsView('chat');
  };

  // Status helpers
  const recentStatuses = seedStatuses.filter((s) => s.recent);
  const viewedStatuses = seedStatuses.filter((s) => s.viewed);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-925 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="md:grid md:grid-cols-[5rem_22rem_1fr] md:h-screen">
          <MainNav activeTab={activeTab} onChange={(t) => { setActiveTab(t); if (t === 'chats') setMobileChatsView('list'); }} isDark={dark} onToggleTheme={() => setDark((d) => !d)} />

          {/* Middle column (Chat list) - visible on desktop when chats tab */}
          <div className={`hidden md:block border-r border-zinc-200 dark:border-zinc-800 ${activeTab === 'chats' ? '' : 'md:opacity-40 md:pointer-events-none'}`}> 
            <ChatList
              chats={chats}
              activeChatId={currentChatId}
              onSelectChat={openChat}
              onOpenGroupWizard={() => setGroupOpen(true)}
            />
          </div>

          {/* Right column (Content) */}
          <div className="hidden md:flex flex-col">
            {activeTab === 'chats' && (
              <ChatWindow
                chat={currentChat}
                messages={messages[currentChatId] || []}
                onBackMobile={() => setMobileChatsView('list')}
                onSendMessage={handleSend}
              />
            )}

            {activeTab === 'status' && (
              <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-lg font-semibold">Status</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-3">My Status</h3>
                    <div className="flex items-center gap-3">
                      {seedStatuses.filter((s) => s.mine).map((s) => (
                        <button key={s.id} onClick={() => setStatusViewer({ index: 0 })} className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full ring-2 ring-emerald-500 overflow-hidden">
                            <img src={s.image} alt="status" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-zinc-500">Tap to view</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-3">Recent updates</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {recentStatuses.map((s, i) => (
                        <button key={s.id} onClick={() => setStatusViewer({ index: i + 1 })} className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 text-left">
                          <img src={s.image} alt={s.name} className="w-full h-40 object-cover" />
                          <div className="p-3">
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-zinc-500">Just now</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-3">Viewed updates</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {viewedStatuses.map((s) => (
                        <div key={s.id} className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                          <img src={s.image} alt={s.name} className="w-full h-40 object-cover" />
                          <div className="p-3">
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-zinc-500">Today</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <ChatWindow
                aiMode
                chat={{ name: 'AI Assistant', color: 'bg-purple-600' }}
                messages={messages.ai || [{ sender: 'them', text: 'Hi! Ask me anything ✨', time: 'Now' }]}
                onBackMobile={() => setMobileChatsView('list')}
                onSendMessage={handleSendAI}
              />
            )}

            {activeTab === 'settings' && (
              <div className="flex-1 bg-white dark:bg-zinc-950">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-lg font-semibold">Settings</h2>
                </div>
                <div className="p-6 space-y-6 max-w-2xl">
                  <section>
                    <h3 className="text-sm font-medium text-zinc-500 mb-3">Profile</h3>
                    <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">YO</div>
                        <div className="flex-1">
                          <p className="font-semibold">Your Name</p>
                          <p className="text-sm text-zinc-500">Hey there! I am using Vibe Chat</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-sm font-medium text-zinc-500 mb-3">Appearance</h3>
                    <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-zinc-500">Switch between light and dark</p>
                      </div>
                      <button
                        onClick={() => setDark((d) => !d)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {dark ? 'Dark' : 'Light'}
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>

          {/* Mobile views */}
          <div className="md:hidden pb-14 min-h-screen">
            {activeTab === 'chats' && (
              <>
                {mobileChatsView === 'list' && (
                  <ChatList
                    chats={chats}
                    activeChatId={currentChatId}
                    onSelectChat={(id) => {
                      openChat(id);
                      setMobileChatsView('chat');
                    }}
                    onOpenGroupWizard={() => setGroupOpen(true)}
                  />
                )}
                {mobileChatsView === 'chat' && (
                  <ChatWindow
                    chat={currentChat}
                    messages={messages[currentChatId] || []}
                    onBackMobile={() => setMobileChatsView('list')}
                    onSendMessage={handleSend}
                  />
                )}
              </>
            )}

            {activeTab === 'status' && (
              <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                  <button onClick={() => setActiveTab('chats')} className="p-2 -ml-2 text-zinc-600 dark:text-zinc-300">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-semibold">Status</h2>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-2">My Status</h3>
                    <div className="flex items-center gap-3">
                      {seedStatuses.filter((s) => s.mine).map((s) => (
                        <button key={s.id} onClick={() => setStatusViewer({ index: 0 })} className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full ring-2 ring-emerald-500 overflow-hidden">
                            <img src={s.image} alt="status" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-zinc-500">Tap to view</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 mb-2">Recent</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {recentStatuses.map((s, i) => (
                        <button key={s.id} onClick={() => setStatusViewer({ index: i + 1 })} className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 text-left">
                          <img src={s.image} alt={s.name} className="w-full h-28 object-cover" />
                          <div className="p-2">
                            <p className="text-sm font-medium">{s.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <ChatWindow
                aiMode
                chat={{ name: 'AI Assistant', color: 'bg-purple-600' }}
                messages={messages.ai || [{ sender: 'them', text: 'Hi! Ask me anything ✨', time: 'Now' }]}
                onBackMobile={() => setActiveTab('chats')}
                onSendMessage={handleSendAI}
              />
            )}

            {activeTab === 'settings' && (
              <div className="flex-1 bg-white dark:bg-zinc-950">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-base font-semibold">Settings</h2>
                </div>
                <div className="p-4 space-y-6">
                  <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-zinc-500">Switch between light and dark</p>
                    </div>
                    <button
                      onClick={() => setDark((d) => !d)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
                    >
                      {dark ? 'Dark' : 'Light'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Group creation modal */}
        <GroupWizard open={groupOpen} onClose={() => setGroupOpen(false)} onCreate={addGroup} />

        {/* Status viewer */}
        {statusViewer && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/95" onClick={() => setStatusViewer(null)} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="h-1.5 bg-zinc-800">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '60%' }} />
              </div>
              <div className="flex-1 flex items-center justify-center p-6">
                <img
                  src={seedStatuses[statusViewer.index]?.image || seedStatuses[0].image}
                  alt="status"
                  className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
