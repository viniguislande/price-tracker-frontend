import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Package, TrendingUp, TrendingDown, DollarSign, Bell, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';
import { getStatistics } from '../services/api';
import { formatPrice } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Package}
          title="Total de Produtos"
          value={stats.total_produtos}
          color="blue"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Maior Alta"
          value={stats.produto_maior_alta ? `${stats.produto_maior_alta.variacao.toFixed(2)}%` : 'N/A'}
          subtitle={stats.produto_maior_alta?.nome}
          color="green"
        />
        
        <StatCard
          icon={TrendingDown}
          title="Maior Baixa"
          value={stats.produto_maior_baixa ? `${stats.produto_maior_baixa.variacao.toFixed(2)}%` : 'N/A'}
          subtitle={stats.produto_maior_baixa?.nome}
          color="red"
        />
        
        <StatCard
          icon={DollarSign}
          title="Produto Mais Caro"
          value={stats.produto_mais_caro ? formatPrice(stats.produto_mais_caro.preco) : 'N/A'}
          subtitle={stats.produto_mais_caro?.nome}
          color="yellow"
        />
        
        <StatCard
          icon={DollarSign}
          title="Produto Mais Barato"
          value={stats.produto_mais_barato ? formatPrice(stats.produto_mais_barato.preco) : 'N/A'}
          subtitle={stats.produto_mais_barato?.nome}
          color="purple"
        />
        
        <StatCard
          icon={Bell}
          title="Alertas Ativos"
          value={stats.total_alertas_ativos}
          subtitle={`${stats.total_alertas_disparados_hoje} disparados hoje`}
          color="blue"
        />
      </div>
    </div>
  );
}

