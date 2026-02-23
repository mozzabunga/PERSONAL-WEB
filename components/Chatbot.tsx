
import React, { useState, useRef, useEffect } from 'react';
import { askPortfolioAssistant } from '../services/geminiService';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioData } from '../types';

interface ChatbotProps {
  currentData: PortfolioData;
}

const Chatbot: React.FC<ChatbotProps> = ({ currentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: `Hi! I'm ${currentData.name.split(' ')[0]}'s AI assistant. Ask me anything about her background!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askPortfolioAssistant(userMsg, currentData);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center gap-2 group border border-white/10"
      >
        <MessageSquare size={24} />
        <span className="hidden group-hover:block text-sm font-black uppercase tracking-widest px-2">Ask AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 glass rounded-[2rem] shadow-2xl z-50 overflow-hidden flex flex-col h-[500px] border border-white/10"
          >
            <div className="p-5 bg-zinc-900 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em]">{currentData.name.split(' ')[0]} AGENT // 07</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/5 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/20'}`}>
                      {m.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-blue-400" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white shadow-xl' : 'bg-zinc-800/50 text-zinc-300 border border-white/5'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-2">
                    <Loader2 size={12} className="animate-spin" />
                    Analyzing Data...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-900/50 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
