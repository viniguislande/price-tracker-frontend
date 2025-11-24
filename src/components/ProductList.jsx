import ProductCard from './ProductCard';
import { ProductListSkeleton } from './Loading';

export default function ProductList({ 
  products = [], 
  loading = false, 
  isFavorite = () => false,
  onAddFavorite,
  onViewDetails,
  showVariation = false
}) {
  if (loading) {
    return <ProductListSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id || product.external_id}
          product={product}
          isFavorite={isFavorite(product.id || product.external_id)}
          onAddFavorite={onAddFavorite}
          onViewDetails={onViewDetails}
          showVariation={showVariation}
        />
      ))}
    </div>
  );
}

