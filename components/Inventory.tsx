
import React, { useState } from 'react';

interface InventoryProps {
  inventory: string[];
  onAddItems: (items: string[]) => void;
  onRemoveItem: (item: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onAddItems, onRemoveItem }) => {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleAdd = () => {
    if (input.trim()) {
      onAddItems([input.trim()]);
      setInput('');
    }
  };

  const simulateScan = async () => {
    setIsScanning(true);
    // Mimic API delay
    await new Promise(r => setTimeout(r, 1500));
    onAddItems(['Chicken Breast', 'Fresh Broccoli', 'Basmati Rice', 'Soy Sauce', 'Large Eggs']);
    setIsScanning(false);
  };

  return (
    <div className="p-4 space-y-6 flex flex-col h-full overflow-hidden">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">My Fridge Deck 🍓</h2>
        <p className="text-sm text-gray-700 font-medium">Track what you have at home</p>
      </header>

      <div className="bg-white p-4 rounded-3xl shadow-md space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 border-none rounded-2xl p-3 focus:ring-2 focus:ring-soft-pink outline-none text-gray-900 placeholder-gray-500 font-medium"
            placeholder="Add item..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            className="bg-soft-pink text-white px-5 rounded-2xl font-bold shadow-sm active:scale-95 transition-transform"
          >
            Add
          </button>
        </div>

        <button
          onClick={simulateScan}
          disabled={isScanning}
          className={`w-full py-3 border-2 border-mint text-mint rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isScanning ? 'opacity-50' : 'hover:bg-mint hover:text-white'}`}
        >
          {isScanning ? (
            <span className="animate-pulse">Scanning Fridge...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Simulate Camera Scan
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {inventory.map((item, idx) => (
            <div 
              key={`${item}-${idx}`}
              className="bg-white px-3 py-2 rounded-xl flex items-center justify-between shadow-sm border border-gray-200 group animate-in fade-in zoom-in duration-300"
            >
              <span className="text-sm font-bold text-gray-800 truncate">{item}</span>
              <button 
                onClick={() => onRemoveItem(item)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {inventory.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-600 font-medium">
              Your fridge is empty! <br/>Add some items to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
