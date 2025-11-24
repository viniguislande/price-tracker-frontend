import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import ProductList from '../components/ProductList';
import Loading, { ProductListSkeleton } from '../components/Loading';
import { getFavorites, removeFavorite, getCategories } from '../services/api';

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoria: '',
    preco_min: '',
    preco_max: '',
    sort_by: 'created_at',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadCategories();
    loadFavorites();
  }, [filters, pagination.page]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        preco_min: filters.preco_min ? parseFloat(filters.preco_min) : null,
        preco_max: filters.preco_max ? parseFloat(filters.preco_max) : null,
      };
      
      const response = await getFavorites(params);
      setFavorites(response.items);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        pages: response.pages
      }));
    } catch (error) {
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Deseja remover este produto dos favoritos?')) {
      return;
    }
    
    try {
      await removeFavorite(id);
      toast.success('Produto removido dos favoritos');
      loadFavorites();
    } catch (error) {
      toast.error('Erro ao remover favorito');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Mínimo
            </label>
            <input
              type="number"
              value={filters.preco_min}
              onChange={(e) => handleFilterChange('preco_min', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Máximo
            </label>
            <input
              type="number"
              value={filters.preco_max}
              onChange={(e) => handleFilterChange('preco_max', e.target.value)}
              placeholder="1000.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={`${filters.sort_by}_${filters.order}`}
              onChange={(e) => {
                const [sort_by, order] = e.target.value.split('_');
                setFilters(prev => ({ ...prev, sort_by, order }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at_desc">Mais recente</option>
              <option value="created_at_asc">Mais antigo</option>
              <option value="preco_asc">Preço: Menor</option>
              <option value="preco_desc">Preço: Maior</option>
              <option value="nome_asc">Nome: A-Z</option>
              <option value="nome_desc">Nome: Z-A</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <ProductListSkeleton />
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">Nenhum favorito encontrado.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Buscar produtos
          </a>
        </div>
      ) : (
        <>
          <ProductList
            products={favorites}
            showVariation={true}
            onViewDetails={(id) => navigate(`/produto/${id}`)}
          />
          
          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ArrowLeft size={20} />
                Anterior
              </button>
              
              <span className="text-gray-700">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próximo
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

