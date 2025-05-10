import React, { useState, useEffect } from 'react';
import { Send, Bot, AlertTriangle, Camera, Paperclip, X } from 'lucide-react';
import maintenanceDiagnosisService from '../services/maintenanceDiagnosisService';

interface MaintenanceChatProps {
  onClose: () => void;
  propertyId: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: string[];
}

const MAINTENANCE_CATEGORIES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Water leaks, clogged drains, toilet issues',
    questions: [
      'Is there any water leakage?',
      'Is the issue affecting multiple fixtures?',
      'How long has this been happening?',
      'Have you tried any basic fixes?'
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Power issues, lighting, electrical fixtures',
    questions: [
      'Are other units affected?',
      'Did you check the circuit breaker?',
      'Are there any burning smells?',
      'Which outlets or fixtures are affected?'
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, cooling, ventilation',
    questions: [
      'Is the thermostat working?',
      'When was the last filter change?',
      'What temperature is it showing?',
      'Are you hearing any unusual sounds?'
    ]
  },
  {
    id: 'pests',
    name: 'Pest Control',
    description: 'Insects, rodents, pest infestations',
    questions: [
      'What type of pests have you seen?',
      'Where are they most active?',
      'When did you first notice them?',
      'Have you used any pest control products?'
    ]
  },
  {
    id: 'appliances',
    name: 'Appliances',
    description: 'Refrigerator, stove, dishwasher issues',
    questions: [
      'Which appliance is having issues?',
      'What are the symptoms?',
      'When did it start?',
      'Is it completely non-functional or partially working?'
    ]
  },
  {
    id: 'structural',
    name: 'Structural',
    description: 'Walls, floors, windows, doors',
    questions: [
      'Where is the damage located?',
      'Is there any water damage visible?',
      'When did you first notice it?',
      'Is it getting worse?'
    ]
  }
];

export default function MaintenanceChat({ onClose, propertyId }: MaintenanceChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Please select the category that best describes your maintenance issue:'
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (selectedCategory && currentQuestionIndex === -1) {
      const category = MAINTENANCE_CATEGORIES.find(c => c.id === selectedCategory);
      if (category) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Let's gather some information about your ${category.name.toLowerCase()} issue. ${category.questions[0]}`
        }]);
        setCurrentQuestionIndex(0);
      }
    }
  }, [selectedCategory]);

  const handleAttachFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || loading) return;

    const category = MAINTENANCE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      attachments: attachments.map(file => URL.createObjectURL(file))
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setLoading(true);
    setError(null);

    try {
      const { response, isUrgent } = await maintenanceDiagnosisService.diagnoseIssue(
        propertyId,
        [...messages, userMessage],
        category.id
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      if (currentQuestionIndex < category.questions.length - 1) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: category.questions[currentQuestionIndex + 1]
        }]);
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (isUrgent) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'This appears to be an urgent situation. I\'ve notified the property manager.'
        }]);
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1e2433] rounded-lg">
      <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-white">Maintenance Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors"
          aria-label="Close maintenance chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {MAINTENANCE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-[#252d40] p-4 rounded-lg hover:bg-[#2a324a] transition-colors text-left"
              >
                <h4 className="font-medium mb-1">{category.name}</h4>
                <p className="text-sm text-gray-400">{category.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#252d40] text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Attachment"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#252d40] rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/50">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {selectedCategory && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="bg-[#252d40] rounded px-2 py-1 flex items-center"
                >
                  <span className="text-xs mr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <label className="cursor-pointer p-2 hover:bg-[#252d40] rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAttachFiles}
                  className="hidden"
                />
                <Camera className="h-5 w-5 text-gray-400" />
              </label>
              <label className="cursor-pointer p-2 hover:bg-[#252d40] rounded-lg transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleAttachFiles}
                  className="hidden"
                />
                <Paperclip className="h-5 w-5 text-gray-400" />
              </label>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#252d40] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && attachments.length === 0)}
              className={`p-2 rounded-lg ${
                loading || (!input.trim() && attachments.length === 0)
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}