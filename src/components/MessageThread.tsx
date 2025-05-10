import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: {
    email: string;
  };
}

interface MessageThreadProps {
  receiverId: string;
  receiverEmail: string;
  onClose?: () => void;
}

export default function MessageThread({ receiverId, receiverEmail, onClose }: MessageThreadProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id && showThread) {
      loadMessages();
      const interval = setInterval(loadMessages, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user?.id, showThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!user?.id) return;
    
    try {
      const data = await messageService.getMessages();
      setMessages(data.filter(m => 
        (m.sender_id === user.id && m.receiver_id === receiverId) ||
        (m.sender_id === receiverId && m.receiver_id === user.id)
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    if (!user?.id) {
      console.error('User not authenticated');
      alert('You must be logged in to send messages.');
      return;
    }

    setLoading(true);
    try {
      await messageService.sendMessage(receiverId, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="flex flex-col h-[200px] bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view messages.</p>
      </div>
    );
  }

  if (!showThread) {
    return (
      <button
        onClick={() => setShowThread(true)}
        className="w-full py-2 px-4 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] transition-colors"
      >
        Start Chat
      </button>
    );
  }

  return (
    <div className="flex flex-col h-[400px] bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3b3b3b] flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Chat with {receiverEmail}
        </h3>
        <button
          onClick={() => {
            setShowThread(false);
            onClose?.();
          }}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender_id === user.id
                  ? 'bg-[#0078d4] text-white'
                  : 'bg-gray-100 dark:bg-[#1b1b1b] text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-[#3b3b3b]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-[#1b1b1b] rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className={`p-2 rounded-lg ${
              loading || !newMessage.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}