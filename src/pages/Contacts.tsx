import React, { useState, useCallback } from 'react';
import { Users, Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import contactService from '../services/contactService';

interface Contact {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  category_id?: string;
  notes?: string;
}

export default function Contacts() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setImportStats(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const contacts = results.data as Contact[];
          let success = 0;
          let failed = 0;

          for (const contact of contacts) {
            try {
              await contactService.addContact(contact);
              success++;
            } catch (err) {
              console.error('Failed to import contact:', contact, err);
              failed++;
            }
          }

          setImportStats({
            total: contacts.length,
            success,
            failed
          });
        } catch (err) {
          setError('Failed to process CSV file');
          console.error(err);
        } finally {
          setImporting(false);
        }
      },
      error: (error) => {
        setError(`Failed to parse CSV file: ${error.message}`);
        setImporting(false);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <label className="relative cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
            <span className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <a
            href="/contact-template.csv"
            download
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Download Template
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {importing && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Importing contacts...</span>
        </div>
      )}

      {importStats && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <Users className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Import Complete
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Total contacts: {importStats.total}</p>
                <p>Successfully imported: {importStats.success}</p>
                {importStats.failed > 0 && (
                  <p className="text-yellow-700">Failed to import: {importStats.failed}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing contacts list component here */}
    </div>
  );
}