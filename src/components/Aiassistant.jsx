import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, Send, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AIAssistant.css';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are LastMinute AI, an expert interview preparation assistant built into the LastMinute.ai platform. You help candidates prepare for job interviews by:

- Answering technical interview questions (DSA, System Design, React, Node.js, etc.)
- Giving career advice and resume tips
- Generating mock interview questions based on roles
- Providing behavioral interview guidance (STAR method)
- Helping with HR round preparation
- Giving last-minute interview tips

Be concise, friendly, and practical. Format code with proper markdown. Keep responses focused and actionable.`;

const QUICK_PROMPTS = [
  "Generate 5 React interview questions",
  "How to answer 'Tell me about yourself'?",
  "Explain system design basics",
  "Top DSA topics for interviews",
  "How to negotiate salary?",
  "STAR method examples",
];

const AIAssistant = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${state.userName?.split(' ')[0] || 'there'}! 👋 I'm your LastMinute AI assistant. I can help you with interview prep, coding questions, career advice, and more. What would you like to work on?`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Listen for header button click to open chat
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAIChat', handleOpen);
    return () => window.removeEventListener('openAIChat', handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    setInput('');
    const userMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'Sorry, I could not process that. Please try again.',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please check your connection and try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! How can I help you prepare for your interview today?`,
    }]);
  };

  const formatMessage = (content) => {
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  // ✅ Only render chat window — no floating button
  if (!isOpen) return null;

  return (
    <div className={`ai-chat-window ${isMaximized ? 'maximized' : ''}`}>
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-header-left">
          <div className="ai-avatar">
            <BrainCircuit size={18} />
          </div>
          <div>
            <p className="ai-chat-title">LastMinute AI</p>
            <p className="ai-chat-status">
              <span className="status-dot"></span> Online
            </p>
          </div>
        </div>
        <div className="ai-chat-header-actions">
          <button onClick={clearChat} title="Clear chat"><Trash2 size={16} /></button>
          <button onClick={() => setIsMaximized(!isMaximized)} title="Toggle size">
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} title="Close"><X size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="ai-message-avatar"><BrainCircuit size={14} /></div>
            )}
            <div
              className="ai-message-bubble"
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="ai-message assistant">
            <div className="ai-message-avatar"><BrainCircuit size={14} /></div>
            <div className="ai-message-bubble ai-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="ai-quick-prompts">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button key={idx} className="quick-prompt-btn" onClick={() => sendMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-chat-input-area">
        <textarea
          ref={inputRef}
          className="ai-chat-input"
          placeholder="Ask me anything about interviews..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className={`ai-send-btn ${(!input.trim() || isLoading) ? 'disabled' : ''}`}
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;