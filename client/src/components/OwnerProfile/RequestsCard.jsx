import React from 'react';
import requestsData from '../../data/requestsData.json';

function RequestsCard() {
  const { requests } = requestsData;

  return (
    <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
          Requests
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Requests</span>
          <span className="text-xl font-semibold text-gray-800">{requests.totalRequests}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
          <span className="text-gray-600">Approved</span>
          <span className="text-xl font-semibold text-green-600">{requests.approvedRequests}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
          <span className="text-gray-600">Rejected</span>
          <span className="text-xl font-semibold text-red-600">{requests.rejectedRequests}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
          <span className="text-gray-600">Pending</span>
          <span className="text-xl font-semibold text-yellow-600">{requests.pendingRequests}</span>
        </div>
      </div>
    </div>
  );
}

export default RequestsCard;
