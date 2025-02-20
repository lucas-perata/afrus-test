import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Package, Users, ShoppingCart } from 'lucide-react';
import { useCustomersTransactions, useProducts } from '../hooks/useApi';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { data: products = [], isLoading: isLoadingP, isError: isErrorP } = useProducts();
  const { data: transactions = [], isLoading: isLoadingCT, isError: isErrorCT } = useCustomersTransactions();

  const customers = React.useMemo(() => {
    return Array.isArray(transactions)
      ? [...new Set(transactions.map(t => t.id))]
      : [];
  }, [transactions]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };


  const { totalRevenue, averageOrderValue } = useMemo(() => {
    const total = transactions.reduce((sum, t) => {
      const value = typeof t.paidPrice === 'string'
        ? parseFloat(t.paidPrice)
        : t.paidPrice;

      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    return {
      totalRevenue: total,
      averageOrderValue: transactions.length > 0 ? total / transactions.length : 0
    };
  }, [transactions]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => {
      const stock = typeof p.stockQuantity === 'string'
        ? parseInt(p.stockQuantity)
        : p.stockQuantity;
      return !isNaN(stock) && stock < 20;
    }).length;
  }, [products]);

  const revenueData = useMemo(() => {

    const dailyRevenue = transactions.reduce((acc, t) => {
      const date = formatDate(t.transactionDate);
      if (!date) return acc;

      const value = typeof t.paidPrice === 'string'
        ? parseFloat(t.paidPrice)
        : t.paidPrice;

      if (isNaN(value)) {
        console.log('Invalid value found:', t.paidPrice);
        return acc;
      }

      acc[date] = (acc[date] || 0) + value;
      return acc;
    }, {});


    const chartData = Object.entries(dailyRevenue)
      .map(([date, value]) => ({
        date,
        revenue: Number(value.toFixed(2))
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);

    return chartData;
  }, [transactions]);

  const stockRanges = useMemo(() => {

    const ranges = [
      { range: '0-10', count: 0 },
      { range: '11-20', count: 0 },
      { range: '21-50', count: 0 },
      { range: '51+', count: 0 }
    ];

    products.forEach(p => {
      const stock = p.stockQuantity;


      if (stock <= 10) {
        ranges[0].count++;
      }
      else if (stock <= 20) {
        ranges[1].count++;
      }
      else if (stock <= 50) {
        ranges[2].count++;
      }
      else {
        ranges[3].count++;
      }
    });

    return ranges;
  }, [products]);


  if (isLoadingCT || isLoadingP) {
    return (
      <Loading />
    );
  }

  if(isErrorCT || isErrorP)
  {
    return (
      <div>No info</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </div>
            <ArrowUpCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-semibold">{formatCurrency(averageOrderValue)}</p>
            </div>
            <ShoppingCart className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{products.length}</p>
            </div>
            <Package className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Alert</p>
              <p className="text-2xl font-semibold">{lowStockProducts}</p>
            </div>
            <ArrowDownCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(transactionValue) => formatCurrency(transactionValue)} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Product Stock Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions?.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {
                      `${transaction.firstName || ''} ${transaction.lastName || ''}`
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(
                      typeof transaction.paidPrice === 'string'
                        ? parseFloat(transaction.paidPrice)
                        : transaction.paidPrice
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(transaction.transactionDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}