import { create } from 'zustand';

export interface UserState {
  id: number;
  email: string;
  name: string | null;
  avatar?: string;
  apiKey?: string;
}

export interface StepwiseStep {
  step: number;
  title: string;
  content: string;
}

export interface Message {
  id: string;
  conversationId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens?: number | null;
  images?: string[];
  stepwise?: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  title?: string | null;
  userId: number;
  metadata?: unknown | null;
  createdAt: Date;
  updatedAt: Date;
}

// User store
export const useUserStore = create<{
  user: UserState;
  setUser: (user: UserState) => void;
}>(set => ({
  user: { id: 0, email: '', name: null },
  setUser: (user) => set({ user }),
}));

// Messages store
export const useMessagesStore = create<{
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}>(set => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set(state => ({ messages: [...state.messages, message] })),
  updateMessage: (id: string, partial: Partial<Message>) => set(state => ({ messages: state.messages.map(m=> m.id===id? {...m, ...partial}: m)})),
}));

// Conversations store
export const useConversationsStore = create<{
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}>(set => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}));

// Current conversation store
export const useCurrentConversationStore = create<{
  currentConversation: Conversation | null;
  setCurrentConversation: (conv: Conversation | null) => void;
}>(set => ({
  currentConversation: null,
  setCurrentConversation: (conv) => set({ currentConversation: conv }),
}));

// Step context store
export const useStepContextStore = create<{
  stepContext: StepwiseStep[];
  addStepToContext: (step: StepwiseStep) => void;
  removeStepFromContext: (stepNumber: number) => void;
  clearStepContext: () => void;
}>(set => ({
  stepContext: [],
  addStepToContext: (step) => set(state => ({ 
    stepContext: [...state.stepContext.filter(s => s.step !== step.step), step] 
  })),
  removeStepFromContext: (stepNumber) => set(state => ({ 
    stepContext: state.stepContext.filter(s => s.step !== stepNumber) 
  })),
  clearStepContext: () => set({ stepContext: [] }),
}));

