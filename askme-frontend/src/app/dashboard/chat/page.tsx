"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Twitter, Linkedin, Github, MessageSquare, User, Loader2, Send, Mic, ArrowLeft } from 'lucide-react';
import Suggestions from './components/Suggestions';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useSession } from "next-auth/react";
import { useUserStore, useMessagesStore, useCurrentConversationStore, useStepContextStore, Message, StepwiseStep } from '@/app/atom';
import { getConversation, createMessage } from '@/helpers/conversation';
import { API_URL } from '@/constants';

// Import LiveKit components for audio mode
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  LiveKitRoom,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import SimpleVoiceAssistant from './components/AudioComponent';

// AudioMode component
function AudioMode({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();
  const room = `${session?.user?.userId}-quickstart-room`;
  const name = `${session?.user?.name}`;
  const [token, setToken] = useState('');
  const [roomInstance] = useState(() => new Room({
    // Enable automatic audio/video quality optimization
    dynacast: true,
  }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          setToken(data.token);

          const livekitUrl = 'wss://pj1-60upvbjy.livekit.cloud';
          await roomInstance.connect(livekitUrl, data.token);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  
    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance, room, name]);
  
  if (token === '') {
    return (
      <div className="h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
          <p className="text-gray-400">Connecting to audio room...</p>
          <button
            onClick={onBack}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    // <RoomContext.Provider value={roomInstance}>
    //   <div data-lk-theme="default" className="h-screen bg-[#0A0A0A] relative">
    //     {/* Back button */}
    //     <button
    //       onClick={onBack}
    //       className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg transition-colors backdrop-blur-sm"
    //     >
    //       <ArrowLeft size={16} />
    //       Back to Chat
    //     </button>
        
    //     <div style={{ height: '100vh' }}>
    //       {/* Your custom component with basic video conferencing functionality. */}
    //       <MyVideoConference />
    //       {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
    //       <RoomAudioRenderer />
    //       {/* Controls for the user to start/stop audio, video, and screen share tracks */}
    //       <ControlBar controls={{
    //         camera: false,
    //         screenShare: false
    //       }} />
    //     </div>
    //   </div>
    // </RoomContext.Provider>

    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
              <RoomAudioRenderer />
              <SimpleVoiceAssistant onLeave={onBack}/>
            </div>
        </RoomContext.Provider>
      );
    }

function App() {
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('id');
  const { data: session } = useSession();
  const user = useUserStore(state => state.user);
  const messages = useMessagesStore(state => state.messages);
  const setMessages = useMessagesStore(state => state.setMessages);
  const addMessage = useMessagesStore(state => state.addMessage);
  const currentConversation = useCurrentConversationStore(state => state.currentConversation);
  const setCurrentConversation = useCurrentConversationStore(state => state.setCurrentConversation);
  
  // Step context store
  const stepContext = useStepContextStore(state => state.stepContext);
  const addStepToContext = useStepContextStore(state => state.addStepToContext);
  const removeStepFromContext = useStepContextStore(state => state.removeStepFromContext);
  const clearStepContext = useStepContextStore(state => state.clearStepContext);

  // Set currentConversation from URL id if present
  useEffect(() => {
    if (conversationIdFromUrl) {
      setCurrentConversation({ 
        id: Number(conversationIdFromUrl),
        userId: user?.id || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }, [conversationIdFromUrl, setCurrentConversation, user]);
  const [inputValue, setInputValue] = useState('');
  // For image upload
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // For stepwise response
  const [stepwise, setStepwise] = useState(false);
  // For audio mode
  const [isAudioMode, setIsAudioMode] = useState(false);
  // filtered messages (future search)
  const [isLoading, setIsLoading] = useState(false);

  // Add character limit constant
  const MAX_INPUT_LENGTH = 1000;

  // Debug: Log current conversation state
  useEffect(() => {
    console.log('Current conversation changed:', currentConversation);
    console.log('Messages state:', messages);
  }, [currentConversation, messages]);

  // Fetch conversation data whenever currentConversation changes
  useEffect(() => {
    const fetchConversation = async () => {
      if (!currentConversation?.id) return;
      try {
        const conversation = await getConversation({ conversationId: currentConversation.id});
        if (conversation?.messages) {
          // sort by createdAt
          const sorted = (conversation.messages as Message[]).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(sorted);
        }
      } catch (err) {
        console.error('Failed to load conversation', err);
      }
    };
    fetchConversation();
  }, [currentConversation?.id, setMessages]);

  // Memoized sorted messages list
  const conversationMessages = messages;


  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [conversationMessages, isLoading]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A] text-white">
        <h1 className="text-2xl">Please log in to access the chat.</h1>
      </div>
    );
  }


  // Simulate AI API call
  async function simulateAIResponse(message: Message): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message.content,
          userId: user?.id,
          images: message.images,
          stepwise: stepwise,
          contextStep: stepContext.length > 0 ? stepContext : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error:', response.status, errorData);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || (!data.response && !data.steps)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from server');
      }

      // If stepwise response, format the steps
      if (data.stepwise && data.steps) {
        return JSON.stringify(data);
      }

      return data.response;
    } catch (error) {
      console.error('Error in simulateAIResponse:', error);
      return "Sorry, I couldn't process your request. Please try again later.";
    }
  }

  // Simulate image upload: save to public/storage and return filenames as userId_filename
  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    const userId = user?.id || 'unknown';
    const uploadPromises = files.map(async (file) => {
      const filename = `${userId}_${file.name}`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', filename);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to upload image');
      }
      const data = await res.json();
      return data.filename;
    });
    return Promise.all(uploadPromises);
  };

  const handleSend = async (text?: string) => {
    const messageToSend = text || inputValue;
    // Debug logging
    console.log('handleSend called with:', { messageToSend, currentConversation, inputValue, selectedImages });
    if (!messageToSend.trim() && selectedImages.length === 0) {
      console.log('Empty message and no images, returning');
      return;
    }
    if (!currentConversation?.id) {
      console.error('No current conversation found:', currentConversation);
      alert('Please select or create a conversation first');
      return;
    }
    // Clear input immediately for better UX
    setInputValue('');
    setSelectedImages([]);
    setImagePreviews([]);
    setIsLoading(true);
    try {
      // Upload images and get filenames
      let imageNames: string[] = [];
      if (selectedImages.length > 0) {
        imageNames = await handleImageUpload(selectedImages);
      }
      // Create optimistic user message first for immediate feedback
      const userMsg: Message = {
        id: Date.now().toString(),
        conversationId: currentConversation.id,
        role: 'user',
        content: messageToSend,
        images: imageNames,
        stepwise: stepwise,
        createdAt: new Date(),
      } as Message;
      // Update UI immediately with user message
      addMessage(userMsg);
      // Get AI response using simulated API call
      const aiResponse = await simulateAIResponse(userMsg);
      // Create AI assistant message
      const assistantMsg: Message = {
        id: Date.now().toString() + '_assistant',
        conversationId: currentConversation.id,
        role: 'assistant',
        content: aiResponse,
        images: [],
        createdAt: new Date(),
      } as Message;
      // Update UI with AI response
      addMessage(assistantMsg);
      // Save both messages to database using createMessage helper
      try {
        await createMessage({
          prompt: messageToSend,
          response: aiResponse,
          conversationId: currentConversation.id,
          images: imageNames
        });
        console.log('Messages saved to database successfully');
      } catch (dbError) {
        console.error('Failed to save to database:', dbError);
        // Continue anyway since UI is already updated
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Show error message to user
      const errorMsg: Message = {
        id: Date.now().toString() + '_error',
        conversationId: currentConversation.id || 0,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        images: [],
        createdAt: new Date(),
      } as Message;
      addMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    handleSend(text);
  };

  // If in audio mode, render AudioMode component
  if (isAudioMode) {
    return <AudioMode onBack={() => setIsAudioMode(false)} />;
  }

  return (
    <div className="h-screen bg-[#0A0A0A] pb-10 text-white flex overflow-hidden">
      {/* Main Content Area - Fixed height */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header - Fixed */}
        <header className="p-4 flex justify-end gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Twitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Github size={20} />
          </a>
        </header>

        {/* Main Content - Fixed height with scrollable messages */}
        <main className="flex-1 flex flex-col px-4 w-6xl max-w-8xl mx-auto h-full">
          {/* Messages Container - Only this section scrolls */}
          <div 
            id="messages-container"
            className="flex-1  no-scrollbar overflow-y-auto py-4 scroll-smooth"
          >
            {conversationMessages.length === 0 ? (
              // Show default UI when no messages exist
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-6xl font-bold mb-4 font-font1">What do you want to ask?</h1>
                <p className="text-gray-400 text-lg mb-8 font-font1">
                  Start a conversation with your AI assistant. Ask anything!
                </p>
                {!currentConversation?.id && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-md">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ No conversation selected. Please create or select a conversation from the sidebar to start chatting.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="space-y-4">
                  {Array.isArray(conversationMessages) && conversationMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-0 overflow-hidden ${
                        message.role === 'user' 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-[#1A1A1A] text-gray-300 border border-gray-700'
                      }`}>
                        <div className="flex items-center gap-2 px-4 pt-4">
                          {message.role === 'user' ? (
                            <User size={16} className="text-blue-200" />
                          ) : (
                            <MessageSquare size={16} className="text-gray-400" />
                          )}
                          <span className={`text-sm ${
                            message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {/* Images above prompt, like ChatGPT */}
                        {message.images && message.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-4 pt-2">
                            {message.images.map((img, idx) => (
                              <div key={img + idx} className="relative group">
                                <Image
                                  src={`/storage/${img}`}
                                  alt={img}
                                  width={220}
                                  height={220}
                                  className="rounded-lg border border-gray-700 object-cover bg-black"
                                />
                                <span className="absolute bottom-1 right-2 bg-black bg-opacity-60 text-xs text-white px-2 py-0.5 rounded hidden group-hover:block">{img}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="px-4 pb-4 pt-2">
                          {/* Check if message content is stepwise JSON */}
                          {(() => {
                            try {
                              const parsed = JSON.parse(message.content);
                              if (parsed.stepwise && parsed.steps) {
                                return (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                      <span className="text-sm font-semibold text-blue-300">
                                        📝 Step-by-step response
                                      </span>
                                      <span className="text-xs text-blue-400 bg-blue-800/50 px-2 py-1 rounded-full">
                                        {parsed.steps.length} steps
                                      </span>
                                    </div>
                                    <div className="space-y-3">
                                      {parsed.steps.map((step: StepwiseStep, idx: number) => {
                                        const isInContext = stepContext.some(s => s.step === step.step);
                                        return (
                                          <div key={idx} className="group relative border border-gray-600 rounded-lg overflow-hidden bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                                            {/* Step Header */}
                                            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                              <div className="flex items-center gap-3">
                                                <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold min-w-[32px] text-center">
                                                  {step.step}
                                                </span>
                                                <h4 className="font-semibold text-blue-200 text-lg">{step.title}</h4>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  if (isInContext) {
                                                    removeStepFromContext(step.step);
                                                  } else {
                                                    addStepToContext(step);
                                                  }
                                                }}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                  isInContext 
                                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 opacity-0 group-hover:opacity-100'
                                                }`}
                                                title={isInContext ? 'Remove from context' : 'Add to context'}
                                              >
                                                {isInContext ? (
                                                  <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Added
                                                  </>
                                                ) : (
                                                  <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                            {/* Step Content */}
                                            <div className="p-4">
                                              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{step.content}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                            } catch {
                              // Not JSON or not stepwise, fall back to regular text
                            }
                            return <p className="whitespace-pre-wrap font-font1">{message.content}</p>;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-4 bg-[#1A1A1A] text-gray-300 border border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-400">AI Assistant</span>
                        </div>
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          <span className="ml-2 text-sm text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Fixed Bottom Section */}
          <div className="border-t border-[#2D2D2D] bg-[#0A0A0A] pt-4 pb-8">
            {/* Step Context Display */}
            {stepContext.length > 0 && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-300">
                      📎 Context Steps ({stepContext.length})
                    </span>
                    <span className="text-xs text-blue-400">
                      These steps will be included in your next question
                    </span>
                  </div>
                  <button
                    onClick={clearStepContext}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stepContext.map((step) => (
                    <div key={step.step} className="flex items-center gap-1 bg-blue-800/50 text-blue-200 text-xs px-2 py-1 rounded-full">
                      <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                        {step.step}
                      </span>
                      <span className="max-w-[150px] truncate">{step.title}</span>
                      <button
                        onClick={() => removeStepFromContext(step.step)}
                        className="text-blue-300 hover:text-red-300 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Box */}
            <HoverBorderGradient
              as="div"
              className="w-full bg-[#1A1A1A] rounded-lg p-4 min-h-[100px] animated-border"
            >
              <div className="min-h-[100px] relative">
                {/* Mode toggles */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <button
                    onClick={() => setStepwise(!stepwise)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      stepwise 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-[#2D2D2D] text-gray-400 hover:bg-[#3A3A3A]'
                    }`}
                  >
                    📝 Steps
                  </button>
                  <button
                    onClick={() => setIsAudioMode(true)}
                    className="text-xs px-2 py-1 rounded transition-colors bg-[#2D2D2D] text-gray-400 hover:bg-[#3A3A3A] flex items-center gap-1"
                    title="Switch to Audio Mode"
                  >
                    <Mic size={12} />
                    Audio
                  </button>
                </div>
                <textarea
                  placeholder="How can I help you today? Try Steps mode, Audio mode, or add images! (max 1000 characters)"
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 pr-12 pt-8 font-font1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 left-2 text-sm text-gray-500 font-font1">
                  {inputValue.length}/{MAX_INPUT_LENGTH}
                </div>
                {/* Image upload button */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute top-2 right-14 opacity-0 w-8 h-8 cursor-pointer"
                  style={{ zIndex: 2 }}
                  id="image-upload-input"
                  disabled={isLoading}
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setSelectedImages(files);
                    // Preview images
                    const previews = files.map(file => URL.createObjectURL(file));
                    setImagePreviews(previews);
                  }}
                />
                <label htmlFor="image-upload-input" className="absolute top-2 right-14 p-2 rounded-lg hover:bg-[#2D2D2D] transition-colors cursor-pointer" style={{ zIndex: 1 }}>
                  <span role="img" aria-label="Upload Image">🖼️</span>
                </label>
                <button
                  onClick={() => handleSend()}
                  disabled={(inputValue.trim().length === 0 && selectedImages.length === 0) || isLoading}
                  className="absolute bottom-2 right-2 p-2 rounded-lg hover:bg-[#2D2D2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} className={isLoading ? "text-gray-600" : "text-gray-400"} />
                </button>
                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={src + idx} className="relative">
                        <Image src={src} alt={`preview-${idx}`} width={80} height={80} className="rounded-lg border border-gray-700 object-contain" />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-0.5 text-xs"
                          onClick={() => {
                            // Remove image from previews and selectedImages
                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                            setSelectedImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </HoverBorderGradient>
            {/* Suggestions */}
            {conversationMessages.length === 0 && (
              <Suggestions onSuggestionClick={handleSuggestionClick} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;