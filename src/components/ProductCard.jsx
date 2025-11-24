import { Heart, ExternalLink, Star } from 'lucide-react';
import { formatPrice, getVariationColor, getVariationIcon } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ 
  product, 
  isFavorite = false, 
  onAddFavorite, 
  onViewDetails,
  showVariation = false 
}) {
  const navigate = useNavigate();

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
    if (onAddFavorite) {
      const externalId = product.external_id || product.id; // Use product.id if external_id is not present (for external products)
      if (externalId) {
        await onAddFavorite(externalId);
      }
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      // Differentiate navigation based on whether it's an external product or a favorited one
      if (product.external_id && !product.preco_original) { // Heuristic for external product
        navigate(`/produto/external/${product.external_id}`);
      } else {
        navigate(`/produto/${product.id}`);
      }
    }
  };

  const variation = product.variacao_percentual;
  const variationColor = getVariationColor(variation);
  const variationIcon = getVariationIcon(variation);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.imagem_url || product.image || 'https://via.placeholder.com/300'}
          alt={product.nome || product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300';
          }}
        />
        {isFavorite && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Star size={14} fill="currentColor" /> Favoritado
          </div>
        )}
        {showVariation && variation !== null && variation !== undefined && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            variationColor === 'green' ? 'bg-green-100 text-green-800' :
            variationColor === 'red' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {variationIcon} {Math.abs(variation).toFixed(2)}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.nome || product.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3 capitalize">
          {product.categoria || product.category}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(product.preco_atual || product.preco_original || product.price)}
            </p>
            {product.preco_original && product.preco_atual && product.preco_atual !== product.preco_original && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.preco_original)}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {!isFavorite && onAddFavorite && (
            <button
              onClick={handleAddFavorite}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Heart size={18} />
              <span>Adicionar</span>
            </button>
          )}
          {isFavorite && (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
            >
              <Heart size={18} />
              <span>Já nos favoritos</span>
            </button>
          )}
          
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={18} />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

