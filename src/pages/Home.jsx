import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import Loading from '../components/Loading';
import { searchProducts, getCategories, addFavorite } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadCategories();
    loadProducts();
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
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
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
    } catch (error) {
      toast.error('Erro ao adicionar aos favoritos');
    }
  };

  const handleViewDetails = (productId) => {
    window.location.href = `/produto/${productId}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Produtos</h1>
      
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
        />
      )}
    </div>
  );
}

