import { useState } from 'react';
import { Bell } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function AlertForm({ productId, currentPrice, onAlertCreated }) {
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setError('Preço deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      await onAlertCreated(productId, price);
      setTargetPrice('');
      setError('');
    } catch (err) {
      setError('Erro ao criar alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell size={24} />
        Criar Alerta de Preço
      </h3>
      
      {currentPrice && (
        <p className="text-sm text-gray-600 mb-4">
          Preço atual: <span className="font-semibold">{formatPrice(currentPrice)}</span>
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Preço Alvo
          </label>
          <input
            type="number"
            id="targetPrice"
            step="0.01"
            min="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Ex: 100.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Criando...' : 'Criar Alerta'}
        </button>
      </form>
    </div>
  );
}

