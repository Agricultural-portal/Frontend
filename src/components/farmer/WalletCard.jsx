import { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Wallet, Plus, X, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const WalletCard = () => {
  const { walletBalance, addMoneyToWallet } = useAppContext();
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleAddMoney = async (amountToAdd) => {
    const numAmount = parseFloat(amountToAdd);
    
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount > 100000) {
      toast.error('Maximum amount is ₹1,00,000');
      return;
    }

    setIsLoading(true);
    try {
      await addMoneyToWallet(numAmount);
      toast.success(`Successfully added ${formatCurrency(numAmount)} to your wallet!`);
      setShowDialog(false);
      setAmount('');
    } catch (error) {
      toast.error(error.message || 'Failed to add money');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (quickAmount) => {
    handleAddMoney(quickAmount);
  };

  return (
    <>
      {/* Wallet Display Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-3 rounded-full">
              <Wallet className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Wallet Balance</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(walletBalance || 0)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus size={16} />
            Add Money
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 pt-4 border-t border-green-200">
          <TrendingUp size={16} className="text-green-600" />
          <span>Secure & Instant Transactions</span>
        </div>
      </div>

      {/* Add Money Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowDialog(false);
                setAmount('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="text-green-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add Money</h2>
                <p className="text-sm text-gray-500">to your wallet</p>
              </div>
            </div>

            {/* Current Balance */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(walletBalance || 0)}
              </p>
            </div>

            {/* Quick Add Buttons */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quick Add</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleQuickAdd(quickAmount)}
                    disabled={isLoading}
                    className="bg-white hover:bg-green-50 border-2 border-green-300 hover:border-green-500 text-green-700 font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    ₹{quickAmount.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Or Enter Custom Amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max="100000"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-lg"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum amount: ₹1,00,000
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleAddMoney(amount)}
              disabled={isLoading || !amount}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Add Money
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletCard;
