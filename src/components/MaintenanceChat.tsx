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
    <div className="flex flex-col h-[600px] bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] shadow-lg">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3b3b3b] flex justify-between items-center bg-gray-50 dark:bg-[#1b1b1b]">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-[#0078d4]" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Maintenance Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close maintenance chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MAINTENANCE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-white dark:bg-[#1b1b1b] p-4 rounded-lg border border-gray-200 dark:border-[#3b3b3b] hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors text-left"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{category.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
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
                      ? 'bg-[#0078d4] text-white'
                      : 'bg-gray-100 dark:bg-[#1b1b1b] text-gray-900 dark:text-white'
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
                <div className="bg-gray-100 dark:bg-[#1b1b1b] rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center text-red-800 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {selectedCategory && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#252525]">
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-[#1b1b1b] rounded px-2 py-1 flex items-center"
                >
                  <span className="text-xs text-gray-700 dark:text-gray-300 mr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-[#1b1b1b] rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAttachFiles}
                  className="hidden"
                />
                <Camera className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </label>
              <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-[#1b1b1b] rounded-lg transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleAttachFiles}
                  className="hidden"
                />
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </label>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-[#1b1b1b] rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0078d4] border-0"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && attachments.length === 0)}
              className={`p-2 rounded-lg ${
                loading || (!input.trim() && attachments.length === 0)
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
              } transition-colors`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}