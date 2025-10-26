import { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from './Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

/**
 * AI Chatbot Component
 * Simple chatbot for asking questions about solar panel system
 */
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your solar energy assistant. Ask me anything about your system's performance, health, or maintenance needs.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('performance') || q.includes('how') && q.includes('doing')) {
      return "Your solar system is performing excellently! You're generating 1.5 kW currently, which is 15% above average for this time of day. Your battery is at 68% charge.";
    } else if (q.includes('power') || q.includes('output')) {
      return "Current power output is 1.5 kW from your solar panels. You're consuming 900W at home and exporting 420W to the grid. Great job generating surplus energy!";
    } else if (q.includes('battery') || q.includes('charge')) {
      return "Your battery is currently at 68% state of charge (SoC) with a voltage of 51.2V. It's charging at 200W. At this rate, it will reach full charge in about 2 hours.";
    } else if (q.includes('maintenance') || q.includes('clean')) {
      return "Based on your system data, I recommend cleaning your panels in the next 2 weeks. Your production has decreased by 8% compared to last month, which is typical when panels need cleaning.";
    } else if (q.includes('health') || q.includes('status')) {
      return "System health is excellent! All components are operating within normal parameters. Battery temperature is 28°C (normal range), and there are no critical alerts.";
    } else if (q.includes('savings') || q.includes('money')) {
      return "Your system is generating surplus energy worth approximately $12-15 per day. You're offsetting about 85% of your typical electricity costs.";
    } else {
      return "I can help you with questions about your system's performance, power output, battery status, health monitoring, and maintenance recommendations. What would you like to know?";
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-emerald-600 text-white rounded-full p-4 shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-600 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="text-white" size={20} />
              <h3 className="font-semibold text-white text-sm">Solar Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-emerald-700 rounded-lg p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your system..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSend}
                className="bg-emerald-600 text-white rounded-lg px-3 py-2 hover:bg-emerald-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                onClick={() => setInput('How is my system performing?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Performance
              </button>
              <button
                onClick={() => setInput('What is my power output?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Power
              </button>
              <button
                onClick={() => setInput('Battery status?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
              >
                Battery
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
