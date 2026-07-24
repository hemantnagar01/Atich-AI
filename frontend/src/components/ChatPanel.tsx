import React, { useState, useEffect, useRef } from 'react';
import { clarifyProject, sendChatMessage } from '../api';
import { Send } from 'lucide-react';

interface ChatPanelProps {
  projectName: string;
  description: string;
  mode?: 'clarify' | 'free';
  blueprintData?: any;
  onComplete?: (answers: Record<string, string>) => void;
  onBlueprintUpdate?: (updates: {section: string, instruction: string}[]) => void;
}

interface Question {
  text: string;
  options: string[];
}

export interface ChatMessage {
  type: 'ai' | 'user';
  text: string;
}

export const ChatPanel: React.FC<ChatPanelProps & { chatHistory: ChatMessage[], setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>> }> = ({ 
  projectName, 
  description, 
  mode = 'clarify', 
  blueprintData,
  onComplete,
  onBlueprintUpdate,
  chatHistory,
  setChatHistory
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(mode === 'clarify');
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const fetchedRef = useRef(false);

  useEffect(() => {
    // Reset fetchedRef if project name or description changes
    fetchedRef.current = false;
  }, [projectName, description]);

  useEffect(() => {
    if (mode === 'clarify' && !fetchedRef.current) {
      const fetchQuestions = async () => {
        try {
          fetchedRef.current = true;
          setIsTyping(true);
          const data = await clarifyProject(projectName, description);
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
            setChatHistory([{ type: 'ai', text: data.questions[0].text }]);
          } else {
            if (onComplete) onComplete({});
          }
        } catch (err: any) {
          console.error("Failed to fetch questions", err);
          setError("Failed to connect to Atich AI. Please try again.");
        } finally {
          setIsTyping(false);
        }
      };
      fetchQuestions();
    } else if (mode === 'free') {
      setChatHistory(prev => {
        if (prev.length === 0) {
          return [{ type: 'ai', text: "Your blueprint is ready! You can review it on the right. Ask me any questions, or tell me if you'd like to change the architecture, tech stack, or features." }];
        }
        return prev;
      });
      setIsTyping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, description, mode]);

  const handleOptionSelect = (option: string) => {
    if (mode !== 'clarify') return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const updatedHistory = [...chatHistory, { type: 'user' as const, text: option }];
    const newAnswers = { ...answers, [currentQuestion.text]: option };
    
    setAnswers(newAnswers);
    
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setChatHistory(updatedHistory);
      setCurrentQuestionIndex(nextIndex);
      setIsTyping(true);
      
      setTimeout(() => {
        setChatHistory([...updatedHistory, { type: 'ai', text: questions[nextIndex].text }]);
        setIsTyping(false);
      }, 800);
    } else {
      setChatHistory(updatedHistory);
      setIsTyping(true);
      
      setTimeout(() => {
        if (onComplete) onComplete(newAnswers);
      }, 500);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    const updatedHistory = [...chatHistory, { type: 'user' as const, text: userText }];
    setChatHistory(updatedHistory);
    setIsTyping(true);
    setError(null);

    try {
      const response = await sendChatMessage(updatedHistory, blueprintData);
      setChatHistory([...updatedHistory, { type: 'ai', text: response.reply }]);
      
      if (response.updates && response.updates.length > 0 && onBlueprintUpdate) {
        onBlueprintUpdate(response.updates);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to communicate with AI.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden glass-panel">
      <div className="p-4 border-b border-border bg-surface/50 font-medium">
        {mode === 'clarify' ? 'Project Clarification' : 'Atich AI'}
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.type === 'user' 
                  ? 'bg-accent-start text-[#07070a] font-medium rounded-br-none' 
                  : 'bg-surface border border-border text-text-primary rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {mode === 'clarify' && !isTyping && currentQuestionIndex < questions.length && (
        <div className="p-4 border-t border-border bg-surface/30">
          <div className="text-xs text-text-secondary mb-2 px-1">Select an option:</div>
          <div className="flex flex-wrap gap-2">
            {questions[currentQuestionIndex].options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className="bg-surface/50 border border-border text-text-primary hover:border-accent-start hover:bg-accent-start/10 hover:text-white transition-colors rounded-full px-4 py-2 text-sm text-left"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'free' && (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-surface/30 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question or request a change..."
            className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-start"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-9 h-9 rounded-full bg-accent-start text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-end transition-colors"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      )}
    </div>
  );
};
