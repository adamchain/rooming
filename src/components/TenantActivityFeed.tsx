import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, DollarSign, Wrench, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'document' | 'message';
  title: string;
  description: string;
  status?: string;
  amount?: number;
  created_at: string;
  metadata?: Record<string, any>;
}

interface TenantActivityFeedProps {
  activities: Activity[];
}

export default function TenantActivityFeed({ activities }: TenantActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-orange-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-[#1e2433] rounded-lg p-4 hover:bg-[#252d40] transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {activity.description}
              </p>
              {activity.status && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              )}
              {activity.amount && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-800 ml-2">
                  ${activity.amount.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}