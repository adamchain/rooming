import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Building2,
  CreditCard,
  Wrench,
  FileText,
  Bell,
  LogOut,
  Send,
  MessageSquare,
  Upload,
  Moon,
  Sun,
  Menu,
  Home,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showMaintenanceChat, setShowMaintenanceChat] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [message, setMessage] = useState('');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo data
  const [data, setData] = useState({
    name: 'Demo Tenant',
    property: {
      id: 'prop123',
      name: 'Sunset Apartments',
      address: '123 Main Street, Anytown USA',
      lease_start: '2024-01-01',
      lease_end: '2025-01-01',
      rent_amount: 1250
    },
    tenant: {
      id: 'tenant123'
    },
    maintenance: [
      {
        id: 'm1',
        title: 'Leaking Faucet',
        description: 'The bathroom sink faucet is leaking continuously.',
        status: 'in_progress',
        priority: 'medium',
        created_at: '2024-04-15T14:30:00Z'
      },
      {
        id: 'm2',
        title: 'Broken Light Fixture',
        description: 'The ceiling light in the living room is not working.',
        status: 'pending',
        priority: 'low',
        created_at: '2024-04-25T09:15:00Z'
      }
    ],
    documents: [
      {
        id: 'd1',
        name: 'Lease Agreement.pdf',
        created_at: '2024-01-01T10:00:00Z'
      },
      {
        id: 'd2',
        name: 'Building Rules.pdf',
        created_at: '2024-01-01T10:05:00Z'
      },
      {
        id: 'd3',
        name: 'Maintenance Policy.pdf',
        created_at: '2024-01-01T10:10:00Z'
      }
    ]
  });

  // Initialize dark mode on component mount
  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Add or remove dark class based on preference
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());

    // Add or remove dark class
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleSubmitMaintenanceRequest = async (e) => {
    e.preventDefault();
    if (isSubmitting || !data) return;

    try {
      setIsSubmitting(true);
      // Simulate the request
      console.log('Creating maintenance request:', {
        property_id: data.property.id,
        tenant_id: data.tenant.id,
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        status: 'pending'
      });

      // Add the new request to the demo data
      setData(prevData => ({
        ...prevData,
        maintenance: [
          {
            id: `m${prevData.maintenance.length + 1}`,
            title: newRequest.title,
            description: newRequest.description,
            priority: newRequest.priority,
            status: 'pending',
            created_at: new Date().toISOString()
          },
          ...prevData.maintenance
        ]
      }));

      // Reset form
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium'
      });
      setShowMaintenanceForm(false);
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaintenanceRequest = () => {
    setShowMaintenanceForm(true);
    setShowMaintenanceChat(false);
  };

  const handleMaintenanceChat = () => {
    setShowMaintenanceChat(true);
    setShowMaintenanceForm(false);
  };

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const handleSectionClick = (section) => {
    if (section === 'maintenance') {
      setShowMaintenanceForm(true);
    }
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Sending message:', message);
    setMessage('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500', text: 'Pending' },
      in_progress: { bg: 'bg-[#0078d4]', text: 'In Progress' },
      completed: { bg: 'bg-green-600', text: 'Completed' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-500', text: 'Unknown' };

    return (
      <span className={`${config.bg} text-white text-xs font-medium px-2 py-1 rounded`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { bg: 'bg-red-500', text: 'Urgent' },
      high: { bg: 'bg-orange-500', text: 'High' },
      medium: { bg: 'bg-yellow-500', text: 'Medium' },
      low: { bg: 'bg-green-600', text: 'Low' }
    };

    const config = priorityConfig[priority] || { bg: 'bg-gray-500', text: 'Unknown' };

    return (
      <span className={`${config.bg} text-white text-xs font-medium px-2 py-1 rounded`}>
        {config.text}
      </span>
    );
  };

  const getNextPaymentDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  function renderDocumentUpload() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Documents</h3>
          <button className="text-sm text-[#0078d4] hover:text-[#106ebe]">Upload New</button>
        </div>

        <div {...getRootProps()} className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#0078d4] bg-[#0078d4]/5' : 'border-gray-300 dark:border-gray-600 hover:border-[#0078d4] dark:hover:border-[#0078d4]'}`}>
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag and drop files here, or click to select files'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported file types: PDF, DOC, DOCX, TXT
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b]">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-[#0078d4] mr-3" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Your Documents</h4>
          <div className="space-y-2">
            {data.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b]">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-[#0078d4] mr-3" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-[#0078d4] hover:text-[#106ebe]">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMaintenanceOptions() {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">How would you like to submit your maintenance request?</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleMaintenanceRequest}
            className="p-4 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
          >
            <Wrench className="h-8 w-8 mb-2 mx-auto text-[#0078d4]" />
            <p className="text-sm font-medium">Submit Form</p>
          </button>
          <button
            onClick={handleMaintenanceChat}
            className="p-4 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
          >
            <MessageSquare className="h-8 w-8 mb-2 mx-auto text-[#0078d4]" />
            <p className="text-sm font-medium">Chat with AI</p>
          </button>
        </div>
      </div>
    );
  }

  function renderMaintenanceHistory() {
    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Maintenance Requests</h3>
          <button
            onClick={() => setActiveSection('maintenance')}
            className="text-sm text-[#0078d4] hover:text-[#106ebe] flex items-center"
          >
            Submit New <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {data.maintenance.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{request.title}</h4>
                <div className="flex space-x-2">
                  {getStatusBadge(request.status)}
                  {getPriorityBadge(request.priority)}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{request.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderMaintenanceForm() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">New Maintenance Request</h3>
          <button
            onClick={() => setShowMaintenanceForm(false)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmitMaintenanceRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              value={newRequest.title}
              onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
              required
              className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              placeholder="e.g. Broken faucet in bathroom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              required
              rows={3}
              className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              placeholder="Please describe the issue in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={newRequest.priority}
              onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
              className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0078d4] hover:bg-[#106ebe]'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  function renderMaintenanceChat() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Maintenance Assistant</h3>
          <button
            onClick={() => setShowMaintenanceChat(false)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Go back
          </button>
        </div>

        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-4 min-h-[300px]">
          <div className="mb-4 p-3 bg-gray-100 dark:bg-[#1b1b1b] rounded-lg inline-block">
            <p className="text-gray-800 dark:text-gray-200">
              Hello! I'm your maintenance assistant. How can I help you today?
            </p>
          </div>

          {/* Chat input */}
          <div className="absolute bottom-4 left-4 right-4">
            <form className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
              <button
                type="submit"
                className="p-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe]"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function renderPaymentsSection() {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Payment Information</h3>

        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment Due</p>
            <p className="text-2xl font-semibold text-[#0078d4]">{formatCurrency(data.property.rent_amount)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due on {getNextPaymentDate()}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded border border-gray-200 dark:border-[#3b3b3b]">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-[#0078d4] flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-[#0078d4] rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium">Credit Card (•••• 4589)</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                </div>
              </div>
            </div>

            <button className="text-sm text-[#0078d4] hover:text-[#106ebe] flex items-center">
              Add payment method <ChevronRight size={16} />
            </button>
          </div>

          <button className="w-full mt-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] text-sm font-medium">
            Make Payment
          </button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Payment History</h4>
          <div className="space-y-2">
            <div className="p-4 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b]">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">April 2024 Rent</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid on Apr 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(data.property.rent_amount)}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b]">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">March 2024 Rent</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid on Mar 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(data.property.rent_amount)}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderHomeSection() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Property Overview</h3>
          <span className="text-sm bg-[#0078d4]/10 text-[#0078d4] py-1 px-2 rounded-full">
            Active Lease
          </span>
        </div>

        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Property</p>
            <p className="font-medium">{data.property.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
            <p className="font-medium">{data.property.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lease Period</p>
            <p className="font-medium">
              {new Date(data.property.lease_start).toLocaleDateString()} to {' '}
              {new Date(data.property.lease_end).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
            <p className="font-medium text-[#0078d4]">{formatCurrency(data.property.rent_amount)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] rounded border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment Due</p>
              <p className="text-2xl font-semibold text-[#0078d4]">{formatCurrency(data.property.rent_amount)}</p>
            </div>
            <button className="px-4 py-2 bg-[#0078d4] text-white rounded hover:bg-[#106ebe] text-sm font-medium">
              Make Payment
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Due on {getNextPaymentDate()}</p>
        </div>

        {renderMaintenanceHistory()}
      </div>
    );
  }

  function renderContent() {
    if (activeSection === 'maintenance') {
      if (showMaintenanceChat) {
        return renderMaintenanceChat();
      } else if (showMaintenanceForm) {
        return renderMaintenanceForm();
      } else {
        return renderMaintenanceOptions();
      }
    }

    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'payments':
        return renderPaymentsSection();
      case 'documents':
        return renderDocumentUpload();
      default:
        return renderHomeSection();
    }
  }

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
    { id: 'documents', icon: FileText, label: 'Documents' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      {/* Top navigation */}
      <header className="bg-white dark:bg-[#1b1b1b] border-b border-gray-200 dark:border-[#3b3b3b] sticky top-0 z-50 transition-colors duration-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={24} />
              </button>
              <img src="/logo-nobg.png" alt="Rooming" className="h-8 w-8 invert" />
              <span className="text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors">
                <Bell size={20} />
              </button>

              <div className="h-8 w-8 rounded-full bg-[#0078d4] flex items-center justify-center text-white font-medium">
                {data.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar for mobile - when open */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-[#1b1b1b] h-full border-r border-gray-200 dark:border-[#3b3b3b] transition-colors duration-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3b3b3b]">
                <div className="flex items-center">
                  <img src="/rooming-logo.png" alt="Rooming" className="h-8 w-8" />
                  <span className="ml-3 text-xl font-medium text-gray-900 dark:text-white">Rooming</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${activeSection === item.id
                      ? 'bg-[#0078d4]/10 text-[#0078d4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                      }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-[#3b3b3b]">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - desktop permanent */}
        <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1b1b1b] transition-colors duration-200">
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${activeSection === item.id
                  ? 'bg-[#0078d4]/10 text-[#0078d4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929]'
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-[#3b3b3b]">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#292929] rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-4xl mx-auto px-4 py-6">
            {/* Welcome banner */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getGreeting()}, {data.name.split(' ')[0]}
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome to your tenant dashboard</p>
            </div>

            {/* Message to property manager */}
            <div className="mb-8">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Send a message to property manager..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`px-4 rounded-md ${message.trim()
                    ? 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
                    : 'bg-gray-300 dark:bg-[#3b3b3b] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            {activeSection === 'home' && (
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3b3b3b] rounded-md hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0078d4]/10 flex items-center justify-center mb-2">
                      <item.icon className="h-5 w-5 text-[#0078d4]" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Main content based on active section */}
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}