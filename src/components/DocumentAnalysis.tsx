import React, { useState } from 'react';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import documentAnalysisService from '../services/documentAnalysisService';

interface DocumentAnalysisProps {
  onAnalysisComplete?: (analysis: string, file: File) => void;
}

export default function DocumentAnalysis({ onAnalysisComplete }: DocumentAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const analyzeDocument = async () => {
    if (!file) {
      setError('Please select a file to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await documentAnalysisService.extractText(file);
      const result = await documentAnalysisService.analyzeDocument(text);
      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result, file);
      }
    } catch (err) {
      setError('Failed to analyze document. Please try again.');
      console.error('Document analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FileText className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Document Analysis</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Document
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              TXT, DOC, DOCX, PDF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {file && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Selected file: {file.name}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        onClick={analyzeDocument}
        disabled={!file || loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading || !file
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Analyzing...' : 'Analyze Document'}
      </button>

      {analysis && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Results</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{analysis}</pre>
          </div>
        </div>
      )}
    </div>
  );
}