'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PiggyBank, Menu, X, User, Pencil, Trash2, Check, X as XIcon } from 'lucide-react';
import { useState } from 'react';
import { useConversationsStore, useCurrentConversationStore } from '@/app/atom';
import { useRouter } from 'next/navigation';

import {createConversation} from '@/helpers/conversation';  




import { deleteConversation, updateConversationTitle } from '@/helpers/conversation';
import type { Conversation } from '@/app/atom';

type SidebarProps = {
  user: {
    userId: number;
    name?: string;
  };
};

export function Sidebar({user}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  // Handle rename
  const handleRenameConversation = async (conv: Conversation) => {
    if (!editTitle.trim()) return;
    try {
      const updated = await updateConversationTitle({ conversationId: conv.id, title: editTitle });
      setConversations(conversations.map(c => c.id === conv.id ? updated : c));
      setEditingId(null);
    } catch {
      alert("Failed to rename conversation");
    }
  };

  // Handle delete
  const handleDeleteConversation = async (conv: Conversation) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await deleteConversation({ conversationId: conv.id });
      setConversations(conversations.filter(c => c.id !== conv.id));
      if (conv.id === useCurrentConversationStore.getState().currentConversation?.id) {
        setCurrentConversation(null);
        router.push("/dashboard/chat");
      }
    } catch {
      alert("Failed to delete conversation");
    }
  };
  const router = useRouter();
  // Get raw conversations from Zustand, then sort outside selector to avoid infinite loop
  const rawConversations = useConversationsStore(state => state.conversations);
  const conversations = [...rawConversations].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt).getTime();
    return bTime - aTime;
  });
  const setConversations = useConversationsStore(state => state.setConversations);
  const setCurrentConversation = useCurrentConversationStore(state => state.setCurrentConversation);

  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
    setIsMobileMenuOpen(false);
    router.push(`/dashboard/chat?id=${conv.id}`);
  };

  const handleCreateConversation = async () => {
    console.log('Creating new conversation', user);
    try {
      const newConv = await createConversation({ userId: user.userId });
      setConversations([...conversations, newConv]);
      setCurrentConversation(newConv);
      setIsMobileMenuOpen(false);
      router.push(`/dashboard/chat?id=${newConv.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create conversation');
    }
  };


  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1E1E1E] text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static w-[280px] bg-[#1E1E1E] border-r border-[#2D2D2D] flex flex-col h-full transition-transform duration-300 ease-in-out z-40",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Navigation Tabs */}
        <div className="flex-1 p-6 gap-2">
          <Link href={"/"} onClick={() => setIsMobileMenuOpen(false)}>
            <div className={cn("flex items-center gap-3 font-font1 text-[#E0E0E0] hover:text-white text-2xl lg:text-3xl cursor-pointer transition-colors px-2 pb-5 font-semibold")}> 
              <span>askMe.in</span>
            </div>
          </Link>
          <nav className="flex flex-col font-font1 gap-3 mt-2">
            {/* Conversation Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 px-2 text-gray-400">
                <span className="text-sm uppercase tracking-wide">Conversations</span>
                <button
                  onClick={handleCreateConversation}
                  className="text-xs bg-[#2D2D2D] px-2 cursor-pointer py-1 rounded hover:bg-[#3A3A3A]"
                >
                  + New
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-xs text-gray-500 px-2">No conversations yet</p>
                ) : (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      className={cn(
                        'group flex items-center px-2 py-1 rounded text-[#E0E0E0] hover:bg-[#2D2D2D] transition-colors',
                        c.id === useCurrentConversationStore.getState().currentConversation?.id && 'bg-[#2D2D2D] font-semibold'
                      )}
                    >
                      {editingId === c.id ? (
                        <>
                          <input
                            className="bg-[#232323] text-[#E0E0E0] rounded px-2 py-1 w-2/3 mr-2 outline-none border border-[#444]"
                            value={editTitle}
                            autoFocus
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleRenameConversation(c);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button className="mr-1" onClick={() => handleRenameConversation(c)} title="Save">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} title="Cancel">
                            <XIcon size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="flex-1 truncate cursor-pointer"
                            onClick={() => handleSelectConversation(c)}
                          >
                            {c.title || `Conversation ${c.id}`}
                          </span>
                          <button
                            className="ml-2 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity"
                            onClick={() => { setEditingId(c.id); setEditTitle(c.title || ""); }}
                            title="Rename"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="ml-1 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                            onClick={() => handleDeleteConversation(c)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
     
            {/* <Link href={"/dashboard/chat"} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={cn("flex items-center gap-3 text-[#E0E0E0] hover:text-white cursor-pointer transition-colors px-2 py-2", pathname === "/dashboard/chat" && "font-semibold")}> 
                <Users2 size={20} />
                <span>Chat</span>
              </div>
            </Link> */}
  
            <Link href={"/dashboard/upgrade"} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={cn("flex items-center gap-3 text-[#E0E0E0] hover:text-white cursor-pointer transition-colors px-2 py-2", pathname === "/dashboard/usage" && "font-semibold")}> 
                <PiggyBank size={20} />
                <span>Upgrade</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Profile Button at bottom */}
        <div className="p-6 border-t border-[#2D2D2D]">
          <Link href={"/dashboard/profile"} onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#E0E0E0] hover:bg-[#2D2D2D] transition-colors">
              <User size={20} />
              <span className="truncate">{user?.name || "jennifer goyal"}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 