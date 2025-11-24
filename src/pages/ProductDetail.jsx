import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Trash2, Bell, Heart } from 'lucide-react';
import Loading from '../components/Loading';
import PriceChart from '../components/PriceChart';
import AlertForm from '../components/AlertForm';
import { formatPrice, getVariationColor, getVariationIcon } from '../utils/helpers';
import { 
  getFavoriteById, 
  getPriceHistory, 
  getAlerts, 
  createAlert, 
  deleteAlert,
  getExternalProductById,
  addFavorite,
  getFavoriteByExternalId
} from '../services/api';

export default function ProductDetail() {
  const { id, externalId } = useParams(); // Obter ambos os parâmetros
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false); // Novo estado para controlar se é favorito
  const [favoriteProductId, setFavoriteProductId] = useState(null); // ID do produto favorito se existir

  useEffect(() => {
    loadData();
  }, [id, externalId]); // Depende de ambos os IDs

  const loadData = async () => {
    setLoading(true);
    try {
      let currentProduct = null;
      let fetchedHistory = [];
      let fetchedAlerts = [];
      let favoritedStatus = false;
      let favProductId = null;

      if (id) { // Se o ID for de um produto favorito
        currentProduct = await getFavoriteById(id);
        if (currentProduct) {
          favoritedStatus = true;
          favProductId = currentProduct.id;
          fetchedHistory = await getPriceHistory(id);
          fetchedAlerts = await getAlerts(id);
        }
      } else if (externalId) { // Se o ID for de um produto externo
        currentProduct = await getExternalProductById(externalId);
        if (currentProduct) {
          // Verificar se este produto externo já é um favorito
          const existingFavorite = await getFavoriteByExternalId(externalId);
          if (existingFavorite) {
            favoritedStatus = true;
            favProductId = existingFavorite.id;
            fetchedHistory = await getPriceHistory(existingFavorite.id);
            fetchedAlerts = await getAlerts(existingFavorite.id);
            // Atualizar o objeto do produto para incluir dados do favorito se necessário
            currentProduct = {
              ...currentProduct,
              ...existingFavorite,
              preco_atual: existingFavorite.preco_atual || existingFavorite.preco_original,
              variacao_percentual: existingFavorite.variacao_percentual
            };
          }
        }
      }

      setProduct(currentProduct);
      setHistory(fetchedHistory);
      setAlerts(fetchedAlerts);
      setIsFavorited(favoritedStatus);
      setFavoriteProductId(favProductId);

      if (!currentProduct) {
        toast.error('Produto não encontrado.');
      }
    } catch (error) {
      toast.error('Erro ao carregar dados do produto.');
      console.error('Erro ao carregar dados do produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!product || isFavorited) return;
    try {
      const addedProduct = await addFavorite(product.id || product.external_id); // Usar id da FakeStore ou external_id
      toast.success('Produto adicionado aos favoritos!');
      // Recarregar dados para mostrar como favorito e carregar histórico/alertas
      navigate(`/produto/${addedProduct.id}`); // Redireciona para a rota de favorito
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao adicionar aos favoritos';
      toast.error(errorMessage);
    }
  };

  const handleCreateAlert = async (productId, targetPrice) => {
    try {
      await createAlert(productId, targetPrice);
      toast.success('Alerta criado com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao criar alerta');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Deseja remover este alerta?')) {
      return;
    }
    
    try {
      await deleteAlert(favoriteProductId, alertId); // Usar favoriteProductId
      toast.success('Alerta removido');
      loadData();
    } catch (error) {
      toast.error('Erro ao remover alerta');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Produto não encontrado</p>
      </div>
    );
  }

  const variation = product.variacao_percentual;
  const variationColor = getVariationColor(variation);
  const variationIcon = getVariationIcon(variation);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Produto */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src={product.imagem_url || product.image || 'https://via.placeholder.com/400'}
              alt={product.nome || product.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <h1 className="text-3xl font-bold mb-2">{product.nome || product.title}</h1>
            <p className="text-gray-500 capitalize mb-4">{product.categoria || product.category}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Preço Original:</span>
                <span className="font-semibold">{formatPrice(product.preco_original || product.price)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Preço Atual:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.preco_atual || product.preco_original || product.price)}
                </span>
              </div>
              
              {isFavorited && variation !== null && variation !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Variação:</span>
                  <span className={`font-semibold ${
                    variationColor === 'green' ? 'text-green-600' :
                    variationColor === 'red' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {variationIcon} {Math.abs(variation).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>

            {!isFavorited && (
              <button
                onClick={handleAddFavorite}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Heart size={18} />
                <span>Adicionar aos Favoritos</span>
              </button>
            )}
          </div>

          {isFavorited && (
            <PriceChart 
              priceHistory={history}
              alertPrice={alerts.find(a => a.ativo)?.preco_alvo}
            />
          )}
        </div>

        {/* Alertas */}
        {isFavorited && (
          <div className="space-y-6">
            <AlertForm
              productId={favoriteProductId} // Usar favoriteProductId
              currentPrice={product.preco_atual || product.preco_original}
              onAlertCreated={handleCreateAlert}
            />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell size={24} />
              Alertas Ativos
            </h3>
            
            {alerts.length === 0 ? (
              <p className="text-gray-500">Nenhum alerta configurado</p>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        Alerta: {formatPrice(alert.preco_alvo)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {alert.ativo ? 'Ativo' : 'Inativo'} • 
                        {alert.notificado ? ' Notificado' : ' Pendente'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

