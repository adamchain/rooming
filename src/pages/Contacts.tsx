import React, { useState, useCallback } from 'react';
import { Users, Upload, AlertCircle, Download, Plus, Phone, AtSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import Papa from 'papaparse';
import contactService from '../services/contactService';

export default function Contacts() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [importStats, setImportStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for UI demonstration
  const mockContacts = [
    { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', company: 'ABC Services', category: 'Contractor' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-987-6543', company: 'City Plumbing', category: 'Plumber' },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '555-789-0123', company: 'Elite Electrical', category: 'Electrician' },
    { id: '4', name: 'Emily Wilson', email: 'emily@example.com', phone: '555-456-7890', company: 'Clean Team', category: 'Cleaning Service' },
    { id: '5', name: 'Robert Davis', email: 'robert@example.com', phone: '555-234-5678', company: 'Green Thumb Landscaping', category: 'Landscaper' },
  ];

  React.useEffect(() => {
    // For demonstration purposes, use mock data
    // In a real app, you would fetch from contactService
    setContacts(mockContacts);
  }, []);

  const handleFileUpload = useCallback((event) => {
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
          const contacts = results.data;
          let success = 0;
          let failed = 0;

          for (const contact of contacts) {
            try {
              // In a real app: await contactService.addContact(contact);
              // For demo, just simulate a delay
              await new Promise(resolve => setTimeout(resolve, 100));
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

          // Add the new contacts to our list for demo purposes
          setContacts(prev => [...prev, ...contacts.slice(0, success)]);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Contacts</h1>

        <div className="flex items-center space-x-3">
          <button
            className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </button>

          <label className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-[#0078d4] text-[#0078d4] hover:bg-[#0078d4] hover:text-white font-medium rounded transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
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
            className="inline-flex items-center px-3 py-2 text-sm text-[#0078d4] hover:underline"
          >
            <Download className="h-4 w-4 mr-1" />
            Template
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {importing && (
        <div className="flex justify-center items-center bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-8 transition-colors duration-200">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Importing contacts...</span>
        </div>
      )}

      {importStats && (
        <div className="rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                Import Complete
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                <p>Total contacts: {importStats.total}</p>
                <p>Successfully imported: {importStats.success}</p>
                {importStats.failed > 0 && (
                  <p className="text-yellow-700 dark:text-yellow-400">Failed to import: {importStats.failed}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              <thead className="bg-gray-50 dark:bg-[#1b1b1b]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#0078d4]/10 flex items-center justify-center text-[#0078d4]">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {contact.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <AtSign className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {contact.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{contact.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                        {contact.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button className="text-[#0078d4] hover:text-[#106ebe] mr-3 transition-colors">
                        Edit
                      </button>
                      <button className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty state */}
      {contacts.length === 0 && !loading && !importing && (
        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-12 text-center transition-colors duration-200">
          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No contacts found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by adding your first contact or importing a list.</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </button>
            <label className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-[#0078d4] text-[#0078d4] hover:bg-[#0078d4] hover:text-white font-medium rounded transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}