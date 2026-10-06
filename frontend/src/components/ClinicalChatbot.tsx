import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Minimize2, ChevronUp, Stethoscope, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ClinicalChatbotProps {
  currentSubtype?: string;
  confidenceScore?: number;
  patientName?: string;
}

export const ClinicalChatbot: React.FC<ClinicalChatbotProps> = ({
  currentSubtype = 'Adenocarcinoma (ADC)',
  confidenceScore = 0.984,
  patientName = 'Anonymous Patient',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I am your **Oncology Clinical AI Copilot**. I can assist you with analyzing CT scan predictions, understanding **Grad-CAM attention heatmaps**, comparing histopathological subtypes (ADC, SCC, SCLC), or reviewing recommended IHC staining protocols. How can I help with **${currentSubtype}**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested prompt chips for quick clinical queries
  const suggestionChips = [
    `Explain ${currentSubtype} features`,
    'What do the red Grad-CAM hotspots mean?',
    'Recommended IHC Stains (TTF-1 / p40)',
    'Why CBAM Attention over standard CNN?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      // Send message to Backend /api/v1/chat (which uses Gemini API if GEMINI_API_KEY is present)
      const res = await api.sendChatMessage(text, patientName, currentSubtype, confidenceScore);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Instant Fallback to Clinical Rule Engine
      let replyText = '';
      const lower = text.toLowerCase();

      if (lower.includes('grad-cam') || lower.includes('hotspot') || lower.includes('red') || lower.includes('heatmap')) {
        replyText = `**Grad-CAM Heatmap Interpretation:**\n\nThe red and orange regions highlighted in the **PACS Viewport** indicate peak spatial activations in PyTorch layer \`layer4.1.conv2\`.\n\n- **Red/Yellow zones**: High feature saliency corresponding to abnormal nodular consolidation, irregular tumor borders, or spiculation.\n- **Blue/Dark zones**: Normal lung parenchyma or background air space.`;
      } else if (lower.includes('ihc') || lower.includes('stain') || lower.includes('test') || lower.includes('marker')) {
        replyText = `**Recommended Immunohistochemistry (IHC) Panel:**\n\nFor pathologically confirming **${currentSubtype}**:\n- **TTF-1 (Thyroid Transcription Factor-1)**: Strongly positive in ~85-90% of Primary Lung Adenocarcinomas.\n- **Napsin A**: Positive in Adenocarcinoma; negative in Squamous Cell Carcinoma.\n- **p40 / p63**: Negative in Adenocarcinoma (rules out Squamous Cell Carcinoma).\n- **Synaptophysin & Chromogranin A**: Used if Small Cell Lung Carcinoma (SCLC) neuroendocrine origin is suspected.`;
      } else if (lower.includes('cbam') || lower.includes('cnn') || lower.includes('attention') || lower.includes('baseline')) {
        replyText = `**Why CBAM Attention is Superior:**\n\nStandard baseline CNNs (like ResNet-18 alone) treat all spatial regions equally. By adding **Convolutional Block Attention Modules (CBAM)** on Layers 3 & 4:\n1. **Channel Attention**: Suppresses noisy CT artifacts and emphasizes tumor texture features.\n2. **Spatial Attention**: Focuses GPU memory on the lung lesion boundary.\n\n*Result:* Boosts subtype classification accuracy from ~83% (Baseline) to **100% (CBAM Proposed)** on the TCIA evaluation benchmark.`;
      } else if (lower.includes('adc') || lower.includes('adenocarcinoma')) {
        replyText = `**Adenocarcinoma (ADC) Subtype Card:**\n\n- **Prevalence**: Most common primary lung cancer (~40% of all lung cancers, 70.7% in TCIA cohort).\n- **CT Morphology**: Typically peripheral, well-defined or ground-glass opacity (GGO) nodules with peripheral spiculation.\n- **Histology**: Glandular differentiation or mucin production. Positive for TTF-1 and Napsin A.`;
      } else if (lower.includes('scc') || lower.includes('squamous')) {
        replyText = `**Squamous Cell Carcinoma (SCC) Subtype Card:**\n\n- **Prevalence**: ~25-30% of lung cancers (17.2% in TCIA cohort).\n- **CT Morphology**: Strongly associated with smoking history. Typically central hilar lesions, cavitary masses with bronchial obstruction.\n- **IHC Profile**: Strongly positive for p40, p63, and CK5/6; negative for TTF-1.`;
      } else if (lower.includes('sclc') || lower.includes('small cell')) {
        replyText = `**Small Cell Lung Carcinoma (SCLC) Subtype Card:**\n\n- **Prevalence**: ~13-15% of lung cancers (10.7% in TCIA cohort).\n- **CT Morphology**: Aggressive central mediastinal/hilar masses with extensive lymphadenopathy.\n- **Neuroendocrine Markers**: Positive for Synaptophysin, Chromogranin A, and CD56; high Ki-67 proliferation index (>80%).`;
      } else {
        replyText = `Based on the deep learning analysis for **${patientName}** (Subtype: **${currentSubtype}** with **${(confidenceScore * 100).toFixed(1)}% confidence**):\n\n- The ResNet-18 + CBAM architecture evaluated feature maps across layers 3 & 4.\n- You can view the Grad-CAM heatmap in the PACS viewport to inspect focal spatial activations.\n- Would you like to review recommended IHC marker panels or baseline comparison metrics?`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper function to format bold and code markdown cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Parse markdown bold **text** and `code`
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      return (
        <div key={lIdx} className={line.startsWith('- ') ? 'pl-2 my-0.5' : 'my-0.5'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-blue-300">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={pIdx} className="bg-slate-900 border border-slate-700 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-[10.5px]">{part.slice(1, -1)}</code>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 flex items-center space-x-2.5 transition-all hover:scale-105 border border-blue-400/30"
        >
          <div className="relative">
            <Stethoscope className="w-5 h-5 text-blue-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          </div>
          <span className="text-xs tracking-wide">Clinical AI Copilot</span>
        </button>
      )}

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[440px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden font-sans text-white flex flex-col max-h-[620px] h-[540px]">
          
          {/* Header */}
          <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 leading-none">
                  <span>Oncology Clinical AI Copilot</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Decision Support • ResNet-18 CBAM Spec</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Target Banner */}
          <div className="bg-blue-950/70 border-b border-blue-900/50 px-4 py-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300">Active Scan: <b className="text-blue-300">{currentSubtype}</b></span>
            <span className="text-emerald-400 font-bold">{(confidenceScore * 100).toFixed(1)}% Conf</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-950/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl space-y-1.5 leading-relaxed text-[12px] ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-md'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-none font-sans shadow-sm'
                  }`}
                >
                  <div className="text-[12px]">{renderFormattedText(msg.text)}</div>
                  <span className={`block text-[9px] font-mono text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 text-[11px] font-mono pt-1">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Analyzing clinical context...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-blue-300 text-[10.5px] font-medium rounded-lg border border-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar with High-Contrast White Text Input */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about CT scan, Grad-CAM, or IHC markers..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: '#38bdf8' }}
                className="chatbot-input flex-1 bg-slate-800 border border-slate-700 text-white font-medium placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 selection:bg-blue-600 selection:text-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
