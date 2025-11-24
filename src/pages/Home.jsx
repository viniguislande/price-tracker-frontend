import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import Loading from '../components/Loading';
import { searchProducts, getCategories, addFavorite, getFavorites } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoritedProductIds, setFavoritedProductIds] = useState(new Set()); // Novo estado para IDs de favoritos

  useEffect(() => {
    loadCategories();
    loadProducts();
    loadFavoritedProducts(); // Carregar favoritos ao montar
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadProducts = async (category = null) => {
    setLoading(true);
    try {
      const prods = await searchProducts(category);
      setProducts(prods);
      // Recarregar favoritos para atualizar a lista de IDs favoritados
      await loadFavoritedProducts();
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritedProducts = async () => {
    try {
      // Buscar todos os favoritos e extrair os external_ids
      const favorites = await getFavorites({ limit: 100 });
      const ids = new Set(favorites.items?.map(fav => fav.external_id) || []);
      setFavoritedProductIds(ids);
    } catch (error) {
      console.error('Erro ao carregar produtos favoritos para verificação:', error);
      // Em caso de erro, apenas não carrega os favoritos, mas não quebra a aplicação
    }
  };

  const handleSearch = async (query, category) => {
    setSelectedCategory(category);
    await loadProducts(category);
  };

  const handleAddFavorite = async (externalId) => {
    try {
      await addFavorite(externalId);
      toast.success('Produto adicionado aos favoritos!');
      setFavoritedProductIds(prev => new Set(prev).add(externalId)); // Atualiza o estado de favoritos
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao adicionar aos favoritos';
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (productId) => {
    // A navegação é tratada no ProductCard agora
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mercado - Rastreamento de Preços</h1>
      <p className="text-center text-gray-600 mb-6">Acompanhe os preços dos produtos do seu mercado favorito</p>
      
      <SearchBar
        categories={categories}
        onSearch={handleSearch}
        loading={loading}
      />
      
      {loading ? (
        <Loading />
      ) : (
        <ProductList
          products={products}
          onAddFavorite={handleAddFavorite}
          onViewDetails={handleViewDetails}
          isFavorite={(id) => favoritedProductIds.has(id)} // Passa a função de verificação
        />
      )}
    </div>
  );
}

