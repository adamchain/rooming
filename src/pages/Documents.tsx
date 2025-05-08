import React, { useState } from 'react';
import { FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Documents() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDocumentSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocument(file);
      setError(null);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedDocument || !question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const content = await selectedDocument.text();

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal document expert. Analyze documents and answer questions about them accurately and professionally."
          },
          {
            role: "user",
            content: `Document content: ${content}\n\nQuestion: ${question}`
          }
        ]
      });

      setAnswer(response.choices[0]?.message?.content || 'No answer available');
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError('Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Document Hub</h1>
      </div>

      <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleDocumentSelect}
              className="block w-full text-sm text-gray-700 dark:text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-[#0078d4]/10 file:text-[#0078d4]
                hover:file:bg-[#0078d4]/20 cursor-pointer
                bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-[#3b3b3b] rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ask a Question
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about the document..."
                className="flex-1 rounded border border-gray-300 dark:border-[#3b3b3b] bg-white dark:bg-[#1b1b1b] text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
              <button
                onClick={handleAskQuestion}
                disabled={!selectedDocument || !question.trim() || loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white ${loading || !selectedDocument || !question.trim()
                  ? 'bg-[#0078d4]/50 cursor-not-allowed'
                  : 'bg-[#0078d4] hover:bg-[#106ebe]'
                  } transition-colors`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
            </div>
          )}

          {answer && (
            <div className="rounded bg-gray-50 dark:bg-[#1b1b1b] border border-gray-200 dark:border-[#3b3b3b] p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Answer</h3>
              <div className="prose dark:prose-invert max-w-none">
                {answer.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}