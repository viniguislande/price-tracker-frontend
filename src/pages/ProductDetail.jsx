import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Trash2, Bell } from 'lucide-react';
import Loading from '../components/Loading';
import PriceChart from '../components/PriceChart';
import AlertForm from '../components/AlertForm';
import { formatPrice, getVariationColor, getVariationIcon } from '../utils/helpers';
import { getFavoriteById, getPriceHistory, getAlerts, createAlert, deleteAlert } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prod, hist, alts] = await Promise.all([
        getFavoriteById(id),
        getPriceHistory(id),
        getAlerts(id)
      ]);
      setProduct(prod);
      setHistory(hist);
      setAlerts(alts);
    } catch (error) {
      toast.error('Erro ao carregar dados do produto');
    } finally {
      setLoading(false);
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
      await deleteAlert(id, alertId);
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
              src={product.imagem_url || 'https://via.placeholder.com/400'}
              alt={product.nome}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <h1 className="text-3xl font-bold mb-2">{product.nome}</h1>
            <p className="text-gray-500 capitalize mb-4">{product.categoria}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Preço Original:</span>
                <span className="font-semibold">{formatPrice(product.preco_original)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Preço Atual:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.preco_atual || product.preco_original)}
                </span>
              </div>
              
              {variation !== null && variation !== undefined && (
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
          </div>

          {/* Gráfico */}
          <PriceChart 
            priceHistory={history}
            alertPrice={alerts.find(a => a.ativo)?.preco_alvo}
          />
        </div>

        {/* Alertas */}
        <div className="space-y-6">
          <AlertForm
            productId={parseInt(id)}
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
      </div>
    </div>
  );
}

