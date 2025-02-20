import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCustomers } from '../hooks/useApi';
import Loading from '../components/Loading';

const CustomerList = () => {
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const {data: customers, isLoading, isError} = useCustomers();

  if(isLoading)
  {
    return <Loading/>
  }

  if(isError)
  {
    return <div>No info</div>
  }

  const toggleCustomer = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer List</h1>
      
      <div className="grid gap-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Customer Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleCustomer(customer.id)}
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {customer.firstName} {customer.lastName}
                </h2>
                <div className="text-sm text-gray-600">
                  <p>{customer.documentType}: {customer.documentId}</p>
                  <p>Created: {formatDate(customer.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {customer.transactions.length} Transactions
                </span>
                {expandedCustomer === customer.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* Transactions List */}
            {expandedCustomer === customer.id && (
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(transaction.transactionDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {formatCurrency(transaction.paidPrice)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {formatCurrency(transaction.tax)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                            {transaction.relatedEventId.slice(0, 8)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;