import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Bell,
  RefreshCcw,
  TrendingDown
} from 'lucide-react';

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setStocks([
        {
          id: 1,
          name: "Amoxicillin 500mg",
          currentStock: 150,
          minimumStock: 100,
          supplier: "PharmSupply Inc",
          lastRestocked: new Date(2024, 1, 15),
          status: "normal" // normal, low, critical
        },
        {
          id: 2,
          name: "Ibuprofen 400mg",
          currentStock: 50,
          minimumStock: 200,
          supplier: "MedStock Ltd",
          lastRestocked: new Date(2024, 1, 10),
          status: "critical"
        }
        // Add more mock data as needed
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const sendRestockNotification = (product) => {
    const newNotification = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      supplier: product.supplier,
      status: 'pending',
      timestamp: new Date()
    };
    setNotifications([newNotification, ...notifications]);
  };

  const getStockStatusColor = (status) => {
    switch(status) {
      case 'normal':
        return 'text-green-500';
      case 'low':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Inventory Management
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredStocks.map(stock => (
            <div key={stock.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{stock.name}</h3>
                  <p className="text-gray-600">Supplier: {stock.supplier}</p>
                </div>
                <div className={`flex items-center gap-2 ${getStockStatusColor(stock.status)}`}>
                  {stock.status === 'critical' && <AlertTriangle className="h-5 w-5" />}
                  {stock.status === 'low' && <TrendingDown className="h-5 w-5" />}
                  <span className="capitalize">{stock.status}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-600">Current Stock</div>
                  <div className="font-medium text-lg">{stock.currentStock} units</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-600">Minimum Stock</div>
                  <div className="font-medium text-lg">{stock.minimumStock} units</div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCcw className="h-4 w-4" />
                  Last restocked: {new Date(stock.lastRestocked).toLocaleDateString()}
                </div>
                {stock.status === 'critical' && (
                  <button
                    onClick={() => sendRestockNotification(stock)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    Notify Supplier
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}