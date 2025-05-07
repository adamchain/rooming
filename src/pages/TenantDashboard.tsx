import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Building2,
  CreditCard,
  Wrench,
  FileText,
  Mail,
  Bell,
  LogOut,
  ConciergeBell as ConciergeService,
  Upload,
  MessageSquare,
  Clock,
  Send
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import propertyServiceService from '../services/propertyServiceService';
import tenantActivityService from '../services/tenantActivityService';
import MaintenanceChat from '../components/MaintenanceChat';
import maintenanceService from '../services/maintenanceService';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  website_url: string;
}

interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'document' | 'message';
  title: string;
  description: string;
  status?: string;
  amount?: number;
  created_at: string;
}

const DEMO_DATA = {
  name: 'John Smith',
  property: {
    id: '123e4567-e89b-12d3-a456-426614174000', // Added property ID
    name: 'Sunset Apartments',
    address: '123 Main Street, Apt 4B',
    lease_start: '2024-01-01',
    lease_end: '2024-12-31',
    rent_amount: 1500
  },
  tenant: {
    id: '123e4567-e89b-12d3-a456-426614174001', // Added tenant ID
  },
  maintenance: [
    {
      id: '1',
      title: 'Leaking Faucet',
      description: 'Kitchen sink faucet is dripping continuously',
      status: 'in_progress',
      priority: 'medium',
      created_at: '2024-04-15'
    },
    {
      id: '2',
      title: 'AC Not Cooling',
      description: 'Air conditioning unit is not cooling effectively',
      status: 'pending',
      priority: 'high',
      created_at: '2024-04-14'
    }
  ],
  documents: [
    {
      id: '1',
      name: 'Lease Agreement',
      date: '2024-01-01',
      type: 'PDF'
    },
    {
      id: '2',
      name: 'Move-in Inspection',
      date: '2024-01-01',
      type: 'DOC'
    }
  ]
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showMaintenanceChat, setShowMaintenanceChat] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [message, setMessage] = useState('');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles[0]);
    }
  });

  useEffect(() => {
    if (DEMO_DATA.tenant.id && DEMO_DATA.property.id) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [servicesData, activitiesData] = await Promise.all([
        propertyServiceService.getServices(DEMO_DATA.property.id),
        tenantActivityService.getActivities(DEMO_DATA.tenant.id)
      ]);
      setServices(servicesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmitMaintenanceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await maintenanceService.createRequest({
        property_id: DEMO_DATA.property.id,
        tenant_id: DEMO_DATA.tenant.id,
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        status: 'pending'
      });

      // Reset form and show success state
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium'
      });
      setShowMaintenanceForm(false);
      
      // Reload activities to show new request
      loadData();
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('Uploading file:', file);
  };

  const handleMaintenanceRequest = () => {
    setShowMaintenanceForm(true);
    setShowMaintenanceChat(false);
  };

  const handleMaintenanceChat = () => {
    setShowMaintenanceChat(true);
    setShowMaintenanceForm(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSectionClick = (section: string) => {
    if (section === 'maintenance') {
      setShowMaintenanceForm(true);
    }
    setActiveSection(section);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', message);
    setMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
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

  const navigationItems = [
    { id: 'home', icon: Building2, label: 'Home', color: 'blue-500' },
    { id: 'payments', icon: CreditCard, label: 'Pay Rent', color: 'green-500' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance', color: 'red-500' },
    { id: 'documents', icon: FileText, label: 'Documents', color: 'yellow-500' },
    { id: 'activity', icon: Clock, label: 'Activity', color: 'purple-500' },
    { id: 'contact', icon: Mail, label: 'Contact', color: 'pink-500' },
    { id: 'services', icon: ConciergeService, label: 'Services', color: 'indigo-500' },
  ];

  return (
    <div className="bg-[#161c2c] text-white min-h-screen">
      <header className="bg-[#1e2433] py-4 px-6 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/rooming-logo.png" alt="Rooming" className="h-8 w-8" />
            <h1 className="text-2xl font-semibold">Rooming</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#252d40] rounded-full transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#252d40] rounded-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold">{getGreeting()}, {DEMO_DATA.name.split(' ')[0]}</h2>
          </div>

          <form onSubmit={handleSendMessage} className="mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Send a message to property manager..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 py-3 px-4 rounded-lg bg-[#1e2433] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className={`px-4 rounded-lg ${
                  message.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-3 gap-6 mb-16">
            {navigationItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`flex flex-col items-center bg-[#1e2433] rounded-lg p-4 hover:bg-[#252d40] transition-colors cursor-pointer ${
                  activeSection === item.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`mb-3 bg-${item.color} rounded-full p-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {showMaintenanceChat ? (
            <MaintenanceChat
              onClose={() => setShowMaintenanceChat(false)}
              propertyId={DEMO_DATA.property.id}
            />
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );

  function renderMaintenanceOptions() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Maintenance Request</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleMaintenanceRequest}
            className="p-4 bg-[#1e2433] rounded-lg hover:bg-[#252d40] transition-colors"
          >
            <Wrench className="h-8 w-8 mb-2 mx-auto text-blue-500" />
            <p className="text-sm font-medium">Submit Form</p>
          </button>
          <button
            onClick={handleMaintenanceChat}
            className="p-4 bg-[#1e2433] rounded-lg hover:bg-[#252d40] transition-colors"
          >
            <MessageSquare className="h-8 w-8 mb-2 mx-auto text-green-500" />
            <p className="text-sm font-medium">Chat with AI</p>
          </button>
        </div>
      </div>
    );
  }

  function renderActivityFeed() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 bg-[#1e2433] rounded-lg hover:bg-[#252d40] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                  {activity.amount && (
                    <p className="text-green-500">{formatCurrency(activity.amount)}</p>
                  )}
                  {activity.status && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(activity.status)
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderDocumentUpload() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300">Drag & drop files here, or click to select files</p>
          <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX, TXT</p>
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (activeSection) {
      case 'home':
        return (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">Property Information</h3>
            <div className="bg-[#1e2433] rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Property</p>
                  <p className="text-lg">{DEMO_DATA.property.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-lg">{DEMO_DATA.property.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Lease Period</p>
                  <p className="text-lg">
                    {new Date(DEMO_DATA.property.lease_start).toLocaleDateString()} -
                    {' '}{new Date(DEMO_DATA.property.lease_end).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Monthly Rent</p>
                  <p className="text-lg text-green-500">{formatCurrency(DEMO_DATA.property.rent_amount)}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Next Payment Due</p>
                <p className="text-lg">{getNextPaymentDate()}</p>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">Payment Information</h3>
            <div className="bg-[#1e2433] rounded-lg p-6">
              <div className="mb-6">
                <p className="text-gray-400 text-sm">Next Payment Due</p>
                <p className="text-2xl font-semibold text-green-500">{formatCurrency(DEMO_DATA.property.rent_amount)}</p>
                <p className="text-gray-400 text-sm mt-2">Due on {getNextPaymentDate()}</p>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Make Payment
              </button>
            </div>
          </div>
        );

      case 'maintenance':
        return showMaintenanceChat ? (
          <MaintenanceChat
            onClose={() => setShowMaintenanceChat(false)}
            propertyId={DEMO_DATA.property.id}
          />
        ) : showMaintenanceForm ? (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">New Repair Request</h3>
            <div className="bg-[#1e2433] rounded-lg p-6">
              <form onSubmit={handleSubmitMaintenanceRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Issue Title
                    </label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      required
                      className="w-full bg-[#252d40] border-0 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full bg-[#252d40] border-0 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                      className="w-full bg-[#252d40] border-0 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMaintenanceForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#252d40] rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                        isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          renderMaintenanceOptions()
        );

      case 'documents':
        return renderDocumentUpload();

      case 'activity':
        return renderActivityFeed();

      case 'services':
        return (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">Available Services</h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-[#1e2433] rounded-lg p-4 hover:bg-[#252d40] transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium">{service.name}</h4>
                      <p className="text-gray-400 text-sm">{service.price}</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}