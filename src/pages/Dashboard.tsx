import React from 'react';
import { MessageThread } from '../components/MessageThread';

const Dashboard = ({ data }) => {
  return (
    <div>
      {/* Messages Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.property?.name || tenant.property?.address}</p>
                </div>
              </div>
              <MessageThread 
                receiverId={tenant.auth_id} 
                receiverEmail={tenant.email}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;