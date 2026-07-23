import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Paperclip, ChevronDown, Cpu, X, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderRotate } from './BorderRotate';

interface PromptViewProps {
  onStart: (name: string, description: string) => void;
}

function ArrowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PromptView: React.FC<PromptViewProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT 5.5');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Close when clicking outside model selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsModelSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (name.trim() || description.trim()) {
      let generatedName = name.trim();
      if (!generatedName && description.trim()) {
         const words = description.trim().split(' ');
         generatedName = words.slice(0, 3).join(' ') || 'Untitled Project';
      }
      onStart(generatedName, description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const models = ['GPT 5.5', 'Claude 3.5', 'Llama 3'];

  const showArrow = name.trim() !== '' || description.trim() !== '';

  const onActionButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showArrow) {
      handleSubmit();
    }
  };

  return (
      <div className="z-10 w-full max-w-3xl flex flex-col items-center mx-auto" ref={containerRef}>
        
        <form onSubmit={handleSubmit} className="w-full flex justify-center cursor-text">
          <div className="relative p-[1px] shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full rounded-[16px]">
            {/* Background Layer with BorderRotate */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <BorderRotate 
                backgroundColor="#0a0a0a"
                borderWidth={1}
                borderRadius={16}
                animationSpeed={4}
                className="w-full h-full"
              >
                <div className="w-full h-full backdrop-blur-xl rounded-[15px]" />
              </BorderRotate>
            </div>

            {/* Foreground Content Layer */}
            <div className="w-full h-full relative z-10 flex flex-col rounded-[15px] p-1.5">
              <div className="flex flex-col w-full min-h-[140px]">
                
                <div className="px-2 pt-2 flex-1 relative flex flex-col">
                  {/* Project Name Input */}
                  <input 
                    type="text" 
                    placeholder="Project Name (e.g. TaskMaster)" 
                    className="bg-transparent border-none outline-none px-4 py-2 text-lg font-semibold text-white placeholder-white/40 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  
                  {/* Separator */}
                  <div className="w-[calc(100%-2rem)] mx-auto h-px bg-white/5 my-1" />

                  <textarea 
                    ref={descriptionInputRef}
                    placeholder="Describe your idea in detail..." 
                    className="bg-transparent border-none outline-none px-4 py-2 text-[15px] text-white placeholder-white/30 w-full resize-none min-h-[70px]"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    required={name.trim() === ''}
                  />
                </div>
                
                {/* Attached Files Display */}
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-5 pb-2">
                    {files.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 shadow-sm">
                        {file.type.startsWith('image/') ? <ImageIcon className="w-3.5 h-3.5 text-accent-start" /> : <FileText className="w-3.5 h-3.5 text-accent-end" />}
                        <span className="text-xs text-white/80 max-w-[120px] truncate">{file.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-white/40 hover:text-white transition-colors ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Tools and Actions */}
                <div className="flex items-center justify-between px-5 pb-3 pt-2 relative">
                  {/* Left Side: Model Selector */}
                  <div className="relative">
                    <button 
                      type="button" 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                      onClick={(e) => { e.stopPropagation(); setIsModelSelectorOpen(!isModelSelectorOpen); }}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      {selectedModel}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>

                    <AnimatePresence>
                      {isModelSelectorOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 mb-2 w-40 bg-[#1A1A24] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
                        >
                          {models.map(m => (
                            <button
                              key={m}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors ${selectedModel === m ? 'text-accent-start font-medium' : 'text-white/70'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedModel(m);
                                setIsModelSelectorOpen(false);
                              }}
                            >
                              {m}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Side: Attach, Action Button */}
                  <div className="flex items-center gap-2 pr-12">
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.html,.tsx,.ts,.jsx,.js,.css,.txt,.md,.json,.csv" 
                    />
                    <button
                      type="button"
                      className="p-2 text-white/40 hover:text-white transition-all rounded-full hover:bg-white/10"
                      title="Attach Media"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action Button (Submit) */}
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                    onClick={onActionButtonClick}
                    aria-label="Send prompt"
                    className={`absolute right-3 bottom-3 z-[10] flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all duration-300 hover:opacity-90 outline-none ${showArrow ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-[0_0_20px_rgba(var(--accent-start),0.3)]' : 'bg-transparent hover:bg-white/10 text-white/40 hover:text-white opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="relative flex h-full w-full items-center justify-center">
                      <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] opacity-100 scale-100 rotate-0 blur-none">
                        <ArrowUpIcon />
                      </span>
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
  );
};
